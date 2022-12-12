import type OreumHttpRequest from '../request'
import type OreumHttpResponse from '../response'

export type OreumHttpMethod = 'GET' | 'PUT' | 'POST' | 'HEAD' | 'PATCH' | 'DELETE' | 'OPTIONS'
export type OreumHttpMethodGroup = 'GROUP'
export type OreumHttpMethodWithGroup = OreumHttpMethod | OreumHttpMethodGroup
export type OreumHttpHandlerPath = string | RegExp | { (path: string, request: OreumHttpRequest): boolean }
export type OreumHttpHandlerFunction = (request: OreumHttpRequest, response: OreumHttpResponse) => Promise<unknown | void> | unknown | void

export interface OreumHttpHandlerOptions {
  priority?: number,
  authority?: Array<string> | string,
  origin?: boolean
}

export default class OreumHttpHandler {
  readonly #path?: OreumHttpHandlerPath
  readonly #handler?: OreumHttpHandlerFunction
  public readonly priority: number
  readonly #authority?: Array<string> | string
  readonly #origin: boolean

  constructor (path?: OreumHttpHandlerPath, handler?: OreumHttpHandlerFunction, options?: OreumHttpHandlerOptions) {
    this.#path = path
    this.#handler = handler
    this.priority = options?.priority || 0
    if (options?.authority) {
      this.#authority = options.authority
    }
    this.#origin = !!options?.origin
  }

  get authority () {
    return this.#authority
  }

  public handle (request: OreumHttpRequest, response: OreumHttpResponse): Promise<unknown | void> | unknown | void {
    if (this.#checkPath(request)) {
      if (this.checkAuthority(request)) {
        console.log(request.path, this.#origin, request.origin)
        if (this.#origin && this.#handler) {
          response.setOrigin(typeof request.origin === 'string' ? request.origin : 'origin://')
        }

        const result = this.#handler?.(request, response)

        if (!result) {
          response.unsetOrigin()
        }

        return result
      } else {
        return response.forbidden()
      }
    }
  }

  #checkPath (request: OreumHttpRequest): boolean {
    if (this.#path) {
      if (this.#path instanceof Function) {
        return this.#path(request.path, request)
      }
      if (this.#path instanceof RegExp) {
        return this.#path.test(request.path)
      }
      return this.#path === request.path
    }
    return true
  }

  public checkAuthority (request: OreumHttpRequest): boolean {
    if (this.#authority) {
      if (typeof request.authority === 'string') {
        if (typeof this.#authority === 'string') {
          return request.authority === this.#authority
        }
        return this.#authority.includes(request.authority)
      }
      return false
    }
    return true
  }
}