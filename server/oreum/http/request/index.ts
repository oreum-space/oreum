import type { Http2ServerRequest, IncomingHttpHeaders } from 'http2'
import type { OreumHttpMethod } from '../handler'
import OreumHttpRequestBody from './body'

export default class OreumHttpRequest {
  readonly #request: Http2ServerRequest
  readonly #body: OreumHttpRequestBody
  readonly #authority: ReturnType<typeof this.header>
  readonly #origin: ReturnType<typeof this.header>
  #url?: URL
  #query?: Record<string, unknown>

  constructor (request: Http2ServerRequest) {
    this.#request = request
    this.#body = new OreumHttpRequestBody(request)
    this.#authority = this.header(':authority')
    this.#origin = this.header('origin')
  }

  get authority () {
    return this.#authority
  }

  get origin () {
    return this.#origin
  }

  public header (key: keyof IncomingHttpHeaders) {
    return this.#request.headers[key]
  }

  public get method (): OreumHttpMethod {
    return this.#request.method as OreumHttpMethod
  }

  public get url (): URL {
    return this.#url || (this.#url = new URL(`${this.#request.scheme}://${this.#request.authority}${this.#request.url}`))
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