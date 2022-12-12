import { OutgoingHttpHeaders } from 'http'
import * as http2 from 'http2'
import { Http2ServerResponse } from 'http2'
import { lookup } from 'mime-types'
import { gzip } from 'zlib'
import { OreumCacheLevel } from '../../cache'
import OreumCacheFile from '../../cache/file'
import type Oreum from '../../index'
import OreumHttpRequest from '../request'

interface OreumRequest {
  steps: Array<string>,
  actions: Array<string>,
  errors: Array<string>,
  generator: () => AsyncGenerator<string, object | number | string | Uint8Array>
}

export default class OreumHttpResponse {
  readonly #response: Http2ServerResponse
  readonly #oreum: Oreum
  readonly #request: OreumHttpRequest
  #responded = false
  #closed = false

  constructor (response: Http2ServerResponse, oreum: Oreum, request: OreumHttpRequest) {
    this.#oreum = oreum
    this.#response = response
    this.#request = request
    this.unsetOrigin()
  }

  #close (status = 200, headers?: OutgoingHttpHeaders) {
    if (!this.#responded) {
      this.#responded = true
      this.#closed = true
      this.#response.stream.respond({ ...this.#response.getHeaders(), ...headers, ':status': status }, { endStream: true })
    }
  }

  #respond (status = 200, headers?: OutgoingHttpHeaders) {
    if (!this.#responded) {
      this.#responded = true
      this.#response.stream.respond({ ...this.#response.getHeaders(), ...headers, ':status': status }, { endStream: false })
    }
  }

  static #encoder = new TextEncoder()
  static #encode = (string: string) => this.#encoder.encode(string)

  #buffer (data: string | Uint8Array): Uint8Array {
    return data instanceof Uint8Array ? data : OreumHttpResponse.#encode(data)
  }

  #write (data: string | Uint8Array) {
    if (!this.#closed) {
      if (!this.#responded) {
        this.#responded = true
      }
      this.#response.write(this.#buffer(data), 'utf-8')
    }
  }

  #end (data?: string | Uint8Array) {
    if (!this.#closed) {
      const buffer = data ? this.#buffer(data) : undefined
      if (!this.#responded) {
        if (buffer) {
          this.#respond(200, {
            'content-length': buffer.length
          })
        }
        this.#responded = true
      }
      if (buffer) {
        this.#response.end(buffer, 'utf-8')
      } else {
        this.#response.end()
      }
    }
  }

  #sendFile (file: OreumCacheFile): this {
    const ifModifiedSince = this.#request.header('if-modified-since')
    const modified = typeof ifModifiedSince !== 'string' || +new Date(ifModifiedSince) < +file.modifiedDate - 1000

    if (modified) {
      this.#respond(200, {
        [http2.constants.HTTP2_HEADER_CACHE_CONTROL]: 'no-cache',
        [http2.constants.HTTP2_HEADER_CONTENT_LENGTH]: file.buffer.length,
        [http2.constants.HTTP2_HEADER_CONTENT_ENCODING]: 'gzip',
        [http2.constants.HTTP2_HEADER_LAST_MODIFIED]: file.modifiedDate.toUTCString(),
        [http2.constants.HTTP2_HEADER_CONTENT_TYPE]: lookup(file.path) || 'text/plain'
      })

      this.#end(file.buffer)
    } else {
      this.#respond(304)
      this.#end()
    }

    return this
  }

  async #fileFromCache (path: string, level: Exclude<OreumCacheLevel, 0> = OreumCacheLevel.CACHE_RAM, skip?: boolean): Promise<this | void> {
    try {
      return this.#sendFile(await this.#oreum.cache.file(path, level))
    } catch (error) {
      if (skip) {
        return
      }
      console.error(error)
      return this.notFound()
    }
  }

  async #fileFromFileSystem (path: string, skip?: boolean): Promise<this | void> {
    try {
      return this.#sendFile(await new OreumCacheFile(path).get())
    } catch (error) {
      if (skip) {
        return
      }
      if (error instanceof Error && (error as NodeJS.ErrnoException)['code'] === 'ENOENT') {
        return this.notFound()
      }
      this.serverError()
    }
  }

  redirect (to: string): this {
    this.#respond(301, {
      'Location': to
    })
    return this
  }

  file (path: string, level: OreumCacheLevel = OreumCacheLevel.CACHE_RAM) {
    void (level ? this.#fileFromCache(path, level) : this.#fileFromFileSystem(path))
    return this
  }

  folder (handlerPath: string, requestPath: string, folderPath: string, level: OreumCacheLevel = OreumCacheLevel.CACHE_RAM) {
    const path = folderPath + requestPath.slice(handlerPath.length)

    if (path.endsWith('/') || !path.split('/').at(-1)!.includes('.')) return

    try {
      return this.file(path, level)
    } catch (error) {
      return
    }
  }

  async static (handlerPath: string, requestPath: string, folderPath: string, level: OreumCacheLevel = OreumCacheLevel.CACHE_RAM): Promise<this | void> {
    const path = folderPath + requestPath.slice(handlerPath.length)

    if (path.endsWith('/') || !path.split('/').at(-1)!.includes('.')) return

    try {
      return await (level ? this.#fileFromCache(path, level, true) : this.#fileFromFileSystem(path, true))
    } catch (error) {
      return
    }
  }

  json (data?: object | number | string | Uint8Array, headers?: OutgoingHttpHeaders): this {
    const buffer = data instanceof Uint8Array ? data : OreumHttpResponse.#encode(JSON.stringify(data))
    this.#respond(200, {
      ...headers,
      'content-type': 'application/json',
      'content-length': buffer.length
    })
    this.#end(buffer)
    return this
  }

  async #oreumJson (oreumGenerator: OreumRequest) {
    const generator = oreumGenerator.generator()
    let send = 0
    let result = await generator.next()

    while (!result.done) {
      const buffer = new Uint8Array(Math.max(0, (oreumGenerator.steps.indexOf(result.value) + 1) - send)).fill(13)
      if (buffer.length) {
        send += buffer.length
        this.#write(buffer)
      }
      result = await generator.next()
    }
    const data = result.value

    console.log('data will sending')
    console.log(data)

    this.#end(data instanceof Uint8Array ? data : OreumHttpResponse.#encode(JSON.stringify(data)))
  }

  oreumJson (oreumGenerator: OreumRequest, headers?: OutgoingHttpHeaders): this {
    this.#respond(200, {
      ...headers,
      'content-type': 'application/json',
      'oreum-response': 'true',
      'oreum-step': JSON.stringify(oreumGenerator.steps),
      'oreum-actions': JSON.stringify(oreumGenerator.actions),
      'oreum-errors': JSON.stringify(oreumGenerator.errors)
    })
    void this.#oreumJson(oreumGenerator)
    return this
  }

  setOrigin (origin: string) { // TODO add schema
    console.log('trying set origin:', origin)
    if (this.#oreum.properties.http.options?.origins?.includes(origin)) {
      this.#response.setHeader('access-control-allow-origin', origin)
    } else if (this.#oreum.properties.http.options?.origin) {
      this.#response.setHeader('access-control-allow-origin', this.#oreum.properties.http.options.origin)
    }
  }

  unsetOrigin () {
    if (this.#response.getHeader('access-control-allow-origin') !== '*') {
      this.#response.setHeader('access-control-allow-origin', '*')
    }
  }

  badRequest (): this {
    this.#close(400)
    return this
  }

  forbidden (): this {
    this.#close(403)
    return this
  }

  notFound (): this {
    this.#close(404)
    return this
  }

  serverError (): this {
    this.#close(500)
    return this
  }

  notImplemented (): this {
    this.#close(501)
    return this
  }
}