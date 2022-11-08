import CoreHttpHandler, { CoreHttpFunction, CoreHttpHandlerOptions } from './core-http-handler'

export default class CoreHttpRouter extends CoreHttpHandler {
  constructor (method: string, path: string | RegExp, handler: CoreHttpFunction, option?: CoreHttpHandlerOptions) {
    super(method, path, handler, option)
  }
}