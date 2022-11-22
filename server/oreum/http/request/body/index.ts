import type { Http2ServerRequest } from 'http2'

export default class OreumHttpRequestBody {
  readonly #contentType?: string
  readonly #promise: Promise<string | Buffer>
  #chunk?: string | Buffer
  #string?: string
  #json?: unknown
  #jsonOnce?: boolean

  static Error = class OreumHttpRequestBodyError extends Error {
    code: number
    constructor (message?: string, code = 500) {
      super(message)
      this.code = code
    }
  }

  static #decoder = new TextDecoder('utf8')
  static #decode = (buffer: Buffer) => this.#decoder.decode(buffer)
  static #encoder = new TextEncoder()
  static #encode = (string: string) => this.#encoder.encode(string)

  constructor (request: Http2ServerRequest) {
    this.#contentType = request.headers['content-type']
    this.#promise = new Promise<string | Buffer>((resolve) => {
      request.on('data', (chunk: string | Buffer) => {
        resolve(chunk)
      })
    }).then(chunk => {
      if (typeof chunk === 'string') {
        this.#string = chunk
      }
      return this.#chunk = chunk
    })
  }

  #chunk2buffer (chunk: string | Buffer) {
    return chunk instanceof Buffer ? new Uint8Array(chunk.buffer) : OreumHttpRequestBody.#encode(chunk)
  }

  #buffer (): Promise<Uint8Array> {
    return this.#promise.then(this.#chunk2buffer)
  }

  #chunk2string (chunk: string | Buffer) {
    return typeof chunk === 'string' ? chunk : OreumHttpRequestBody.#decode(chunk)
  }

  #json_ <T = unknown> (): Promise<T> | T {
    const string = this.string()

    try {
      return string instanceof Promise ? string.then(_ => JSON.parse(_)) : JSON.parse(string)
    } catch (error) {
      if (error instanceof Error && error.name === 'Syntax Error') {
        throw new OreumHttpRequestBody.Error('Unprocessable entity', 422)
      }
      throw new OreumHttpRequestBody.Error('Unknown error while parsing JSON from request body', 500)
    }
  }

  public string (): Promise<string> | string {
    return this.#string || (this.#chunk ? this.#chunk2string(this.#chunk) : this.#promise.then(this.#chunk2string))
  }

  public buffer (): Promise<Uint8Array> | Uint8Array {
    return this.#chunk ? this.#chunk2buffer(this.#chunk) : this.#buffer()
  }

  public raw (): Promise<string | Buffer> | string | Buffer {
    return this.#chunk || this.#promise
  }

  public json <T = unknown> (): Promise<T> | T {
    return this.#jsonOnce ? this.#json as T : this.#json_<T>()
  }
}
