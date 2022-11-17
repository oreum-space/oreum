import type OreumHttpRequest from '../request'
import type OreumHttpResponse from '../response'

export type OreumHttpMethod = 'GET' | 'PUT' | 'POST' | 'HEAD' | 'PATCH' | 'DELETE' | 'OPTIONS'
export type OreumHttpMethodGroup = 'GROUP'
export type OreumHttpMethodWithGroup = OreumHttpMethod | OreumHttpMethodGroup
export type OreumHttpHandlerPath = string | RegExp | { (path: string): boolean }
export type OreumHttpHandlerFunction = (request: OreumHttpRequest, response: OreumHttpResponse) => Promise<unknown | void> | unknown | void

export default class OreumHttpHandler {
  readonly #path?: OreumHttpHandlerPath
  readonly #handler?: OreumHttpHandlerFunction
  readonly #method?: OreumHttpMethodWithGroup

  constructor (method: OreumHttpMethodWithGroup = 'GET', path?: OreumHttpHandlerPath, handler?: OreumHttpHandlerFunction) {
    this.#handler = handler
    this.#path = path
    this.#method = method
  }

  handle (request: OreumHttpRequest, response: OreumHttpResponse): Promise<unknown | void> | unknown | void {
    if (this.#method === )
    if (this.checkPath()) {

    }
  }

  checkPath (path: string): boolean {
    if (this.#path) {
      if (this.#path instanceof Function) {
        return this.#path(path)
      }
      if (this.#path instanceof RegExp) {
        return this.#path.test(path)
      }
      return this.#path === path
    }
    return true
  }
}