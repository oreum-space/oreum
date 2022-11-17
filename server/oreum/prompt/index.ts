import type Oreum from '../index'

export default class OreumPrompt {
  readonly #oreum: Oreum

  constructor (oreum: Oreum) {
    this.#oreum = oreum
  }
}
