import CoreHttpRequest from './core-http-request'

export type CoreHttpFunction =
  (request: CoreHttpRequest) =>
    Promise<CoreHttpRequest | undefined> |
    CoreHttpRequest | undefined

export type CoreHttpHandlerOptions = {
  disabled?: boolean,
  priority?: number
}

export default class CoreHttpHandler {
  private readonly path: string | RegExp
  private readonly handler: CoreHttpFunction
  private readonly method: string

  // Options
  private disabled: boolean
  public readonly priority: number

  constructor (method: string, path: string | RegExp, handler: CoreHttpFunction, option?: CoreHttpHandlerOptions) {
    this.disabled = !!option?.disabled
    this.priority = option?.priority ?? 0
    this.method = method
    this.handler = handler
    this.path = path
  }

  public handle (request: CoreHttpRequest) {
    if (
      (this.path instanceof RegExp ? request.path.match(request.path) : this.path === request.path) &&
        request.method === this.method
    ) {
      return this.handler(request)
    }
  }
}