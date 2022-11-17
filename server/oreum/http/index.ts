import { createSecureServer, Http2SecureServer } from 'http2'
import Oreum from '../index'
import OreumHttpHandler from './handler'

export default class OreumHttp {
  readonly #handlers: Array<OreumHttpHandler> = []
  readonly #oreum: Oreum
  readonly #server: Http2SecureServer

  constructor (oreum: Oreum) {
    this.#oreum = oreum
    this.#server = createSecureServer(this.#oreum.properties.http.options || {}, OreumHttp.#onRequestHandler)
  }

  static #onRequestHandler () {

  }

  get () {
    this.#handlers.push(new OreumHttpHandler(undefined))
  }

  group (group: OreumHttpGroup) {

  }

  // TODO: get
  // TODO: put
  // TODO: post
  // TODO: head
  // TODO: patch
  // TODO: delete
  // TODO: options
  // TODO: static
  // TODO: static
}