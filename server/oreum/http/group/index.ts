import OreumHttpHandler, {
  OreumHttpHandlerFunction,
  OreumHttpHandlerOptions,
  OreumHttpHandlerPath,
  OreumHttpMethod,
  OreumHttpMethodGroup
} from '../handler'
import OreumHttpRequest from '../request'
import OreumHttpResponse from '../response'

export default class OreumHttpGroup extends OreumHttpHandler {
  readonly #path: string
  readonly #options: OreumHttpHandlerOptions

  protected readonly handlers: Record<OreumHttpMethod, Array<OreumHttpHandler>> & Record<OreumHttpMethodGroup, Array<OreumHttpGroup>> = {
    GET: [],
    PUT: [],
    POST: [],
    HEAD: [],
    PATCH: [],
    DELETE: [],
    OPTIONS: [],
    GROUP: []
  }

  public get path (): string {
    return this.#path
  }

  constructor (path: string, options: OreumHttpHandlerOptions) {
    super(path, OreumHttpGroup.#handle, options)
    this.#path = path
    this.#options = options
  }

  async #handleGroup (this: OreumHttpGroup, request: OreumHttpRequest, response: OreumHttpResponse): Promise<boolean> {
    const groups = this.handlers.GROUP.filter(group => request.path.startsWith(group.path))
    const authGroups: typeof groups = []
    const legitGroups: typeof groups = []

    for (const group of groups) {
      (group.authority ? authGroups : legitGroups).push(group)
    }

    const authGroup = authGroups.find(group => group.checkAuthority(request))

    if (authGroup && await authGroup.handle(request, response)) {
      return true
    }

    for (const group of legitGroups) {
      if (await group.handle(request, response)) {
        return true
      }
    }

    return false
  }

  static async #handle (this: OreumHttpGroup, request: OreumHttpRequest, response: OreumHttpResponse): Promise<boolean> {
    if (await this.#handleGroup(request, response)) {
      return true
    }

    for (const handler of this.handlers[request.method]) {
      if (await handler.handle(request, response)) {
        return true
      }
    }

    return false
  }

  async handleGroup (request: OreumHttpRequest, response: OreumHttpResponse): Promise<boolean> {
    const group = this.handlers.GROUP.find(group => request.path.startsWith(group.path))

    if (group) {
      await group.handle(request, response)
      return true
    }
    return false
  }

  async handle (request: OreumHttpRequest, response: OreumHttpResponse): Promise<boolean> {
    if (await this.handleGroup(request, response)) return true

    for (const handler of this.handlers[request.method]) if (await handler.handle?.(request, response)) return true

    return false
  }

  get (path?: OreumHttpHandlerPath, handler?: OreumHttpHandlerFunction, options?: OreumHttpHandlerOptions) {
    return this.handler('GET', new OreumHttpHandler(path, handler, { ...this.#options, ...options }))
  }

  put (path?: OreumHttpHandlerPath, handler?: OreumHttpHandlerFunction, options?: OreumHttpHandlerOptions) {
    return this.handler('PUT', new OreumHttpHandler(path, handler, { ...this.#options, ...options }))
  }

  post (path?: OreumHttpHandlerPath, handler?: OreumHttpHandlerFunction, options?: OreumHttpHandlerOptions) {
    return this.handler('POST', new OreumHttpHandler(path, handler, { ...this.#options, ...options }))
  }

  head (path?: OreumHttpHandlerPath, handler?: OreumHttpHandlerFunction, options?: OreumHttpHandlerOptions) {
    return this.handler('HEAD', new OreumHttpHandler(path, handler, { ...this.#options, ...options }))
  }

  patch (path?: OreumHttpHandlerPath, handler?: OreumHttpHandlerFunction, options?: OreumHttpHandlerOptions) {
    return this.handler('PATCH', new OreumHttpHandler(path, handler, { ...this.#options, ...options }))
  }

  delete (path?: OreumHttpHandlerPath, handler?: OreumHttpHandlerFunction, options?: OreumHttpHandlerOptions) {
    return this.handler('DELETE', new OreumHttpHandler(path, handler, { ...this.#options, ...options }))
  }

  options (path?: OreumHttpHandlerPath, handler?: OreumHttpHandlerFunction, options?: OreumHttpHandlerOptions) {
    return this.handler('OPTIONS', new OreumHttpHandler(path, handler, { ...this.#options, ...options }))
  }

  handler (method: OreumHttpMethod, handler: OreumHttpHandler): this {
    this.handlers[method].push(handler)
    return this
  }

  group (group: OreumHttpGroup) {
    this.handlers.GROUP.push(group)
  }

  sort () {
    for (const key in this.handlers) {
      const handlers = this.handlers[key as OreumHttpMethod | OreumHttpMethodGroup]
      handlers.sort(({ priority: a }, { priority: b }) => a === b ? 0 : (a < b ? 1 : -1))

      for (const handler of handlers) {
        if ((handler as OreumHttpHandler | OreumHttpGroup) instanceof OreumHttpGroup) {
          (handler as OreumHttpGroup).sort()
        }
      }
    }
  }
}