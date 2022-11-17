import type Oreum from '../index'

export default class OreumCache {
  static #storage = new Map()
  #oreum: Oreum

  constructor (oreum: Oreum) {
    this.#oreum = oreum
  }

  // TODO: file ()
}