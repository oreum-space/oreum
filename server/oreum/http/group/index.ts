import OreumHttpHandler, { OreumHttpHandlerPath } from '../handler'

export default class OreumHttpGroup extends OreumHttpHandler {
  constructor (path: OreumHttpHandlerPath) {
    super('ANY', path, OreumHttpGroup.#handler)
  }

  static #handler () {

  }
}