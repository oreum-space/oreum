import { Http2ServerResponse } from 'http2'

export default class OreumHttpResponse {
  readonly #response: Http2ServerResponse

  constructor (response: Http2ServerResponse) {
    this.#response = response
  }
}