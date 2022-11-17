import type { Http2ServerRequest } from 'http2'

class OreumHttpRequestBody implements Object {
  #promise: Promise<unknown>

  constructor (request: Http2ServerRequest) {
    this.#promise = new Promise((resolve, reject) => {
      request.on('data', (chunk: string | Buffer) => {

      })
    })
  }

  public string (): string {

  }

  public json (): unknown {

  }
}

export default class OreumHttpRequest {
  readonly #request: Http2ServerRequest
  readonly #body: OreumHttpRequestBody
  #query?: Record<string, unknown>
  #url?: URL

  constructor (request: Http2ServerRequest) {
    this.#request = request
    this.#body = new OreumHttpRequestBody(request)
  }

  public get url (): URL {
    return this.#url || (this.#url = new URL(this.#request.url))
  }

  public get path () {
    return this.url.pathname
  }

  public get query () {
    if (this.#query) return this.#query
    const query: Record<string, unknown> = {}

    for (const [key, value] of this.url.searchParams.entries()) {
      query[key] = value
    }

    return this.#query = query
  }

  public get body (): OreumHttpRequestBody {
    return this.#body
  }
}