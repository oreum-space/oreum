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
  private readonly method: string
  protected readonly path: string | RegExp
  protected readonly pathSlices: Array<string>
  protected readonly handler: CoreHttpFunction

  // Options
  private disabled: boolean
  public readonly priority: number

  constructor (method: string, path: string | RegExp, handler: CoreHttpFunction, options?: CoreHttpHandlerOptions) {
    this.disabled = !!options?.disabled
    this.priority = options?.priority ?? 0
    this.method = method
    this.handler = handler
    this.path = path
    this.pathSlices = path instanceof RegExp ? [] : path.split('/').filter(_ => !!_)
  }

  public handle (request: CoreHttpRequest) {
    if (
      (this.path instanceof RegExp) ? this.path.test(request.path) :
      (this.path.includes(':') ? request.match(this.pathSlices) : request.path === this.path) &&
      request.method === this.method
    ) {
      return this.handler.call(this, request)
    }
  }
}