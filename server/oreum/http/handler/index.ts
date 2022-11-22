import type OreumHttpRequest from '../request'
import type OreumHttpResponse from '../response'

export type OreumHttpMethod = 'GET' | 'PUT' | 'POST' | 'HEAD' | 'PATCH' | 'DELETE' | 'OPTIONS'
export type OreumHttpMethodGroup = 'GROUP'
export type OreumHttpMethodWithGroup = OreumHttpMethod | OreumHttpMethodGroup
export type OreumHttpHandlerPath = string | RegExp | { (path: string, request: OreumHttpRequest): boolean }
export type OreumHttpHandlerFunction = (request: OreumHttpRequest, response: OreumHttpResponse) => Promise<unknown | void> | unknown | void

export interface OreumHttpHandlerOptions {
  priority?: number
}

export default class OreumHttpHandler {
  readonly #path?: OreumHttpHandlerPath
  readonly #handler?: OreumHttpHandlerFunction
  public readonly priority: number

  constructor (path?: OreumHttpHandlerPath, handler?: OreumHttpHandlerFunction, options?: OreumHttpHandlerOptions) {
    this.#path = path
    this.#handler = handler
    this.priority = options?.priority || 0
  }

  public handle (request: OreumHttpRequest, response: OreumHttpResponse): Promise<unknown | void> | unknown | void {
    if (this.#checkPath(request.path, request)) {
      return this.#handler?.(request, response)
    }
  }

  #checkPath (path: string, request: OreumHttpRequest): boolean {
    if (this.#path) {
      if (this.#path instanceof Function) {
        return this.#path(path, request)
      }
      if (this.#path instanceof RegExp) {
        return this.#path.test(path)
      }
      return this.#path === path
    }
    return true
  }
}