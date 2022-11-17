// TODO:
import type Oreum from '../index'

export default class OreumSocket {
  readonly #oreum: Oreum

  constructor (oreum: Oreum) {
    this.#oreum = oreum
  }
}