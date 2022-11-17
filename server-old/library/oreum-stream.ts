import { OutgoingHttpHeaders } from 'http2'
import CoreHttpRequest from '../core/http/core-http-request'

class OreumError {
  readonly type = 'oreum-error'
}

class OreumStreamError {
  readonly type = 'oreum-stream-error'

  constructor () {

  }
}

function *oreumGenerator (request: OreumStream) {
  yield

  return
}

export default class OreumStream {
  static #stepper = Symbol('OreumStreamStepper')
  #request: CoreHttpRequest

  constructor (request: CoreHttpRequest, steps: Array<string>, handler: AsyncGenerator<>, headers: OutgoingHttpHeaders) {
    this.#request = request
  }

  async run ()
}