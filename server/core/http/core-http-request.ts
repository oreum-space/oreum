import { readFileSync, Stats, statSync } from 'fs'
import http2, { IncomingHttpHeaders, ServerHttp2Stream, OutgoingHttpHeaders, ServerStreamResponseOptions } from 'http2'
import { gzipSync } from 'zlib'
import output from '../../library/output'
import { lookup } from 'mime-types'

const cache = new Map<string, CoreHttpRequestCachedFile>()

enum CacheLevel {
  NO_CACHE,
  CACHE,
  FORCE_CACHE
}

interface CoreHttpRequestFileOptions {
  cache?: CacheLevel
}

interface CoreHttpRequestStaticOptions extends CoreHttpRequestFileOptions {
  skip?: boolean
}

class CoreHttpRequestCachedFile {
  public readonly path: string
  private readonly force: boolean
  private _buffer: Buffer
  private mtime: Date
  private stats: Stats

  constructor (path: string, cache?: number) {
    this.path = path
    this.force = cache === CacheLevel.FORCE_CACHE
    this.stats = statSync(this.path)
    if (this.stats.isFile()) {
      this._buffer = gzipSync(readFileSync(this.path))
      this.mtime = cache === CacheLevel.CACHE
        ? new Date(new Date(statSync(this.path).mtime).toUTCString())
        : new Date(0)
    } else {
      throw new Error(`Directory cannot be sent! [${path}]`)
    }
  }

  public get buffer () {
    return this._buffer
  }

  public get lastModified (): string {
    return new Date(this.mtime).toUTCString()
  }

  checkFromDisk (): boolean {
    if (this.force) { return false }
    const mtime = new Date(new Date(statSync(this.path).mtime).toUTCString())
    if (+this.mtime !== +mtime) {
      this.mtime = mtime
      this._buffer = gzipSync(readFileSync(this.path))
      return true
    }
    return false
  }

  wasModifiedSince (modifiedSince: Date): boolean {
    if (this.force) { return false }
    return modifiedSince < this.mtime
  }

  toString (): string {
    return this.path
  }
}

export default class CoreHttpRequest {
  readonly stream: ServerHttp2Stream
  readonly headers: IncomingHttpHeaders
  private readonly outgoingHeader: OutgoingHttpHeaders
  public readonly method: string
  public readonly path: string
  private readonly pathSlices: Array<string>
  private currentPathSlices: Array<string>

  constructor (stream: ServerHttp2Stream, headers: IncomingHttpHeaders) {
    this.stream = stream
    this.headers = headers
    this.path = headers[':path'] || '/'
    this.pathSlices = this.path.split('/').filter(_ => !!_)
    const methodFromHeader = headers[http2.constants.HTTP2_HEADER_METHOD]
    this.method = typeof methodFromHeader === 'string' ? methodFromHeader : 'GET'
    this.outgoingHeader = { [http2.constants.HTTP2_HEADER_ACCESS_CONTROL_ALLOW_ORIGIN]: '*' }
    this.currentPathSlices = []
  }

  public setOutgoingHeader (key: string, value: string | string[] | number) {
    this.outgoingHeader[key] = value
  }

  public respond (headers?: OutgoingHttpHeaders, options?: ServerStreamResponseOptions): CoreHttpRequest {
    this.stream.respond({
      ...this.outgoingHeader,
      ...headers
    }, options)
    return this
  }

  public end (cb?: () => void): this
  public end (chunk: any, cb?: () => void): this
  public end (chunk: any, encoding?: BufferEncoding, cb?: () => void): this
  public end (a?: any, b?: any, c?: any): CoreHttpRequest {
    this.stream.end(a, b, c)
    return this
  }

  public data (headers?: OutgoingHttpHeaders, options?: ServerStreamResponseOptions, data?: unknown): CoreHttpRequest {
    this.respond(headers, options)
    this.stream.end(data)
    return this
  }

  private _file (path: string, options?: CoreHttpRequestFileOptions): CoreHttpRequestCachedFile | undefined {
    if (!path.slice(1).split('?').includes('.')) {
      return
    }
    const fileFromCache = options?.cache ? cache.get(path) : undefined

    if (fileFromCache) {
      return fileFromCache
    } else {
      try {
        const newFile = new CoreHttpRequestCachedFile(path, options?.cache)

        if (options?.cache) {
          cache.set(newFile.toString(), newFile)
        }

        return newFile
      } catch (error) {
        if (error instanceof Error) {
          output.error('core-http-request file', error.message)
        }
      }
    }
  }

  private sendFile (file: CoreHttpRequestCachedFile) {
    const lastModified = this.headers['if-modified-since']

    if (lastModified && !file.wasModifiedSince(new Date(lastModified))) {
      this.stream.respond({
        [http2.constants.HTTP2_HEADER_STATUS]: http2.constants.HTTP_STATUS_NOT_MODIFIED
      }, {
        endStream: true
      })
      return this
    }
    this.stream.respond({
      [http2.constants.HTTP2_HEADER_STATUS]: http2.constants.HTTP_STATUS_OK,
      [http2.constants.HTTP2_HEADER_CACHE_CONTROL]: 'no-cache',
      [http2.constants.HTTP2_HEADER_CONTENT_LENGTH]: file.buffer.length,
      [http2.constants.HTTP2_HEADER_CONTENT_ENCODING]: 'gzip',
      [http2.constants.HTTP2_HEADER_LAST_MODIFIED]: file.lastModified,
      [http2.constants.HTTP2_HEADER_CONTENT_TYPE]: lookup(file.path) || 'text/plain'
    })
    this.stream.end(file.buffer)
    return this
  }

  public file (path: string, options?: CoreHttpRequestFileOptions): CoreHttpRequest {
    const file = this._file(path, options)

    return file ? this.sendFile(file) : this.notFound()
  }

  public static (folder: string, options?: CoreHttpRequestStaticOptions): CoreHttpRequest | undefined {
    const path = folder + this.path
    const file = path.match(/.[a-z]{1,4}$/) ? this._file(path, options) : undefined

    return file
      ? this.sendFile(file)
      : (options?.skip ? undefined : this.notFound())
  }

  public notFound () {
    this.stream.respond({
      [http2.constants.HTTP2_HEADER_STATUS]: http2.constants.HTTP_STATUS_NOT_FOUND
    }, {
      endStream: true
    })
    return this
  }

  private log (messages: string | string[]) {
    output.log('core-http-request', messages)
  }

  public param (key: string, numeric?: false): string | undefined
  public param (key: string, numeric: true): number | undefined
  public param (key: string, numeric?: boolean): number | string | undefined {
    const index = this.currentPathSlices.indexOf(`:${key}`)

    if (index !== -1) {
      const value = this.pathSlices[index]

      if (value !== undefined) {
        if (numeric === true) {
          return parseInt(value)
        } else {
          return value
        }
      }
    }
  }

  public match (pathSlices: Array<string>): boolean {
    if (pathSlices.length !== this.pathSlices.length) {
      return false
    }

    for (const [index, slice] of pathSlices.entries()) {
      if (slice[0] !== ':' && slice !== this.path[index]) {
        return false
      }
    }
    this.currentPathSlices = pathSlices
    return true
  }
}
