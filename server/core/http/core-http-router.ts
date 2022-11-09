import CoreHttp from '../core-http'
import CoreHttpHandler, { CoreHttpFunction, CoreHttpHandlerOptions } from './core-http-handler'
import CoreHttpRequest from './core-http-request'

export interface CoreHttpRouterOptions extends CoreHttpHandlerOptions {

}

function f () { return undefined }

export default class CoreHttpRouter extends CoreHttpHandler {
  private readonly handlers: Array<CoreHttpHandler | CoreHttpRouter>

  constructor (path: string | RegExp, options?: CoreHttpRouterOptions) {
    super('ROUTER', path, f, options)
    this.handlers = []
  }

  public async handle (request: CoreHttpRequest) {
    console.log('CoreHttpRouter -> handle', request.path)
    if (
      (this.path instanceof RegExp) ? this.path.test(request.path) :
      (this.path.includes(':') ? request.match(this.pathSlices) : request.path === this.path)
    ) {
      for (const handler of this.handlers) {
        if (await handler.handle(request) instanceof CoreHttpRequest) {
          return request
        }
      }
    }
  }

  public sort () {
    this.handlers.sort(CoreHttp.handlerSorter)
  }

  public get (path: string, handler: CoreHttpFunction, options?: CoreHttpHandlerOptions): this {
    this.handlers.push(new CoreHttpHandler('GET', path, handler, options))
    return this
  }

  // TODO: post
  // TODO: patch
  // TODO: delete
  // TODO: use
}