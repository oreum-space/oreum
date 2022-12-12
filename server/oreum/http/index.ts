import { readFileSync } from 'fs'
import { createSecureServer, Http2SecureServer, Http2ServerRequest, Http2ServerResponse } from 'http2'
import type Oreum from '../index'
import OreumHttpGroup from './group'
import OreumHttpHandler, {
  OreumHttpHandlerOptions,
  OreumHttpHandlerFunction,
  OreumHttpHandlerPath,
  OreumHttpMethod,
  OreumHttpMethodGroup
} from './handler'
import OreumHttpRequest from './request'
import OreumHttpResponse from './response'

export class OreumHttpRaw {
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

  async #handleGroup (request: OreumHttpRequest, response: OreumHttpResponse): Promise<boolean> {
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

  protected async handle (request: OreumHttpRequest, response: OreumHttpResponse): Promise<boolean> {
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

export default class OreumHttp extends OreumHttpRaw {
  readonly #server: Http2SecureServer
  readonly #oreum: Oreum

  constructor (oreum: Oreum) {
    super()
    this.#oreum = oreum
    this.#server = createSecureServer({
      ...this.#oreum.properties.http.options,
      cert: readFileSync(this.#oreum.properties.http.cert),
      key: readFileSync(this.#oreum.properties.http.key)
    }, this.#createOnRequestHandler())
  }

  async #onRequestHandler ($request: Http2ServerRequest, $response: Http2ServerResponse) {
    const request = new OreumHttpRequest($request)
    const response = new OreumHttpResponse($response, this.#oreum, request)

    if (!this.handlers[request.method]) return response.notImplemented()

    try {
      if (await this.handle(request, response)) {
        return
      }
    } catch (error) {
      console.log('#onRequestHandler error:')
      console.error(error)
      response.serverError()
    }

    return response.notFound()
  }

  #createOnRequestHandler () {
    const oreumHttp = this

    return function (this: Http2SecureServer, $request: Http2ServerRequest, $response: Http2ServerResponse) {
      return oreumHttp.#onRequestHandler($request, $response)
    }
  }

  listen () {
    this.sort()
    // setTimeout(() => console.log(this.handlers), 1000)
    return new Promise<void>(_ => this.#server.listen(this.#oreum.properties.http.port, _))
  }
}