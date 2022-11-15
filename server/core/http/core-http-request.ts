import output from '../../library/output'
import http2, { IncomingHttpHeaders, ServerHttp2Stream, OutgoingHttpHeaders, ServerStreamResponseOptions } from 'http2'
import { readFileSync, statSync } from 'fs'
import { gzipSync } from 'zlib'
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

  constructor (path: string, cache?: number) {
    this.path = path
    this.force = cache === CacheLevel.FORCE_CACHE
    const stats = statSync(this.path)
    if (stats.isFile()) {
      this._buffer = gzipSync(readFileSync(this.path))
      this.mtime = cache === CacheLevel.CACHE
        ? new Date(new Date(stats.mtime).toUTCString())
        : new Date(0)
    } else {
      throw new Error(`Directory cannot be sent! [${ path }]`)
    }
  }

  public get buffer () {
    return this._buffer
  }

  public get lastModified (): string {
    return new Date(this.mtime).toUTCString()
  }

  public checkFromDisk (): boolean {
    if (this.force) {
      return false
    }
    const mtime = new Date(new Date(statSync(this.path).mtime).toUTCString())
    if (+this.mtime !== +mtime) {
      this.mtime = mtime
      this._buffer = gzipSync(readFileSync(this.path))
      return true
    }
    return false
  }

  public wasModifiedSince (modifiedSince: Date): boolean {
    if (this.force) {
      return false
    }
    return modifiedSince < this.mtime
  }

  public toString (): string {
    return this.path
  }
}

type CoreHttpRequestErrorReason = 'json' | 'unknown'

class CoreHttpRequestError extends Error {
  public closed: boolean
  public reason: CoreHttpRequestErrorReason

  constructor (error?: Error, reason?: CoreHttpRequestErrorReason, closed?: boolean)
  constructor (message?: string, reason?: CoreHttpRequestErrorReason, closed?: boolean)
  constructor (param?: string | Error, reason?: CoreHttpRequestErrorReason, closed?: boolean) {
    super(param instanceof Error ? param.message : param)
    this.closed = !!closed
    this.reason = reason || 'unknown'
  }
}

export default class CoreHttpRequest {
  public readonly method: string
  public readonly path: string
  public readonly stream: ServerHttp2Stream
  public readonly headers: IncomingHttpHeaders
  private readonly outgoingHeader: OutgoingHttpHeaders
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

  public isRequestError (error: unknown): error is CoreHttpRequestError {
    return error instanceof CoreHttpRequestError
  }

  public setResponseHeader (key: string, value: string | string[] | number) {
    this.outgoingHeader[key] = value
  }

  public respond (headers?: OutgoingHttpHeaders, options?: ServerStreamResponseOptions): this {
    this.stream.respond({
      ...this.outgoingHeader,
      ...headers
    }, options)
    return this
  }

  public end (cb?: () => void): this
  public end (chunk: any, cb?: () => void): this
  public end (chunk: any, encoding?: BufferEncoding, cb?: () => void): this
  public end (a?: any, b?: any, c?: any): this {
    this.stream.end(a, b, c)
    return this
  }

  public data (headers?: OutgoingHttpHeaders, options?: ServerStreamResponseOptions, data?: unknown): CoreHttpRequest {
    this.respond(headers, options)
    this.stream.end(data)
    return this
  }

  public json (data: unknown, headers?: OutgoingHttpHeaders): this {
    return this
      .respond({ ...this.outgoingHeader, ...headers, 'content-type': 'application/json;charset=utf-8' })
      .end(JSON.stringify(data))
  }

  #file (path: string, options?: CoreHttpRequestFileOptions): CoreHttpRequestCachedFile | undefined {
    const fileFromCache = options?.cache ? cache.get(path) : undefined

    if (fileFromCache) {
      return fileFromCache
    }
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

  #sendFile (file: CoreHttpRequestCachedFile) {
    const lastModified = this.headers['if-modified-since']

    if (lastModified && !file.wasModifiedSince(new Date(lastModified))) {
      this.stream.respond({
        [http2.constants.HTTP2_HEADER_STATUS]: http2.constants.HTTP_STATUS_NOT_MODIFIED
      }, {
        endStream: true
      })
      return this
    }
    file.checkFromDisk()
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
    const file = this.#file(path, options)

    try {
      return file ? this.#sendFile(file) : this.notFound()
    } catch {
      return this.notFound()
    }
  }

  public static (folder: string, options?: CoreHttpRequestStaticOptions): CoreHttpRequest | undefined {
    if (options?.skip && !this.path.slice(1).includes('.')) {
      return undefined
    }

    const path = folder + this.path
    const file = path.match(/.[a-z]{1,4}$/) ? this.#file(path, options) : undefined

    try {
      return file
        ? this.#sendFile(file)
        : (
          options?.skip ? undefined : this.notFound()
        )
    } catch {
      this.notFound()
    }
  }

  public notFound () {
    this.stream.respond({
      [http2.constants.HTTP2_HEADER_STATUS]: http2.constants.HTTP_STATUS_NOT_FOUND
    }, {
      endStream: true
    })
    return this
  }

  public header (key: string, numeric?: false): string | undefined
  public header (key: string, numeric: true): number | undefined
  public header (key: string, numeric?: boolean): number | string | undefined {
    const index = this.currentPathSlices.indexOf(`:${ key }`)

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
    if (pathSlices.length !== this.pathSlices.length) return false
    for (const [index, slice] of pathSlices.entries()) {
      if (slice[0] !== ':' && slice !== this.path[index]) {
        return false
      }
    }
    this.currentPathSlices = pathSlices
    return true
  }

  public serverError (): this {
    return this.respond({ ':status': 500 }, { endStream: true })
  }

  public badRequest (body?: unknown): this {
    return body ?
      this.json(body, { ':status': 400 }) :
      this.respond({ ':status': 400 }, { endStream: true })
  }

  // Warning: The client should not repeat this request without modification.
  public unprocessableEntity () {
    this.respond({ ':status': 422 }, { endStream: true })
  }

  public closeIfBodyJsonError (error: unknown): error is CoreHttpRequestError | false {
    if (this.isRequestError(error)) {
      if (error.reason === 'json') {
        this.unprocessableEntity()
        return true
      }
    }
    return false
  }

  public async bodyJSON (): Promise<ReturnType<JSON['parse']>> {
    try {
      return JSON.parse(await new Promise<string>(resolve => {
        this.stream.on('data', (data: Buffer) => {
          resolve(data.toString())
        })
      }))
    } catch (error) {
      this.unprocessableEntity()
      throw (
        new CoreHttpRequestError(
          error instanceof Error ? error : new Error('unknown at CoreHttpRequest.bodyJSON()'),
          'json',
          true
        )
      )
    }
  }
}
