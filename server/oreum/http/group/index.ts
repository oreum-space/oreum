import OreumHttpHandler, {
  OreumHttpHandlerFunction, OreumHttpHandlerOptions,
  OreumHttpHandlerPath,
  OreumHttpMethod,
  OreumHttpMethodGroup
} from '../handler'
import OreumHttpRequest from '../request'
import OreumHttpResponse from '../response'

export default class OreumHttpGroup extends OreumHttpHandler {
  readonly #path: string

  public get path (): string {
    return this.#path
  }

  constructor (path: string) {
    super(path, OreumHttpGroup.#handler)
    this.#path = path
  }

  static #handler () {

  }

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
    return this.handler('GET', new OreumHttpHandler(path, handler, options))
  }

  put (path?: OreumHttpHandlerPath, handler?: OreumHttpHandlerFunction, options?: OreumHttpHandlerOptions) {
    return this.handler('PUT', new OreumHttpHandler(path, handler, options))
  }

  post (path?: OreumHttpHandlerPath, handler?: OreumHttpHandlerFunction, options?: OreumHttpHandlerOptions) {
    return this.handler('POST', new OreumHttpHandler(path, handler, options))
  }

  head (path?: OreumHttpHandlerPath, handler?: OreumHttpHandlerFunction, options?: OreumHttpHandlerOptions) {
    return this.handler('HEAD', new OreumHttpHandler(path, handler, options))
  }

  patch (path?: OreumHttpHandlerPath, handler?: OreumHttpHandlerFunction, options?: OreumHttpHandlerOptions) {
    return this.handler('PATCH', new OreumHttpHandler(path, handler, options))
  }

  delete (path?: OreumHttpHandlerPath, handler?: OreumHttpHandlerFunction, options?: OreumHttpHandlerOptions) {
    return this.handler('DELETE', new OreumHttpHandler(path, handler, options))
  }

  options (path?: OreumHttpHandlerPath, handler?: OreumHttpHandlerFunction, options?: OreumHttpHandlerOptions) {
    return this.handler('OPTIONS', new OreumHttpHandler(path, handler, options))
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