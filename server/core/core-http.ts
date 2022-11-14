import { readFileSync } from 'fs'
import http2, { Http2SecureServer, IncomingHttpHeaders, ServerHttp2Stream } from 'http2'
import ErrnoException = NodeJS.ErrnoException
import * as output from './../library/output'
import CoreHttpHandler, { CoreHttpFunction, CoreHttpHandlerOptions } from './http/core-http-handler'
import CoreHttpRequest from './http/core-http-request'

export type CoreHttpPath = string | RegExp | { (path: string): boolean }

export default class CoreHttp {
  private readonly port: number
  private readonly server: Http2SecureServer
  private readonly handlers: Array<CoreHttpHandler>

  constructor () {
    this.port = process.properties?.http?.port ?? 443
    this.handlers = []
    this.server = http2.createSecureServer({
      ...CoreHttp.certs
    })
    this.server.on('stream', CoreHttp.onStream.bind(this))
  }

  private static async onStream (this: CoreHttp, stream: ServerHttp2Stream, headers: IncomingHttpHeaders) {
    const request = new CoreHttpRequest(stream, headers)

    try {
      for (const handler of this.handlers) {
        if (await handler.handle(request) instanceof CoreHttpRequest) {
          console.log('stop at ', handler['path'])
          return
        }
      }
    } catch (error) {
      if (!stream.closed) {
        stream.close(500)
      }
      output.error('core-http on-stream', error instanceof Error ? error.message : `${error}`)
    }
    if (!stream.closed) {
      request.notFound()
    }
  }

  private static onError (error: ErrnoException, stream: ServerHttp2Stream) {
    CoreHttp.respondOnStreamError(error, stream)
  }

  private static respondOnStreamError (error: ErrnoException, stream: ServerHttp2Stream) {
    output.error('core-http', [error.name, error.message])
    stream.respond({
      ':status': error.code === 'ENOENT'
        ? http2.constants.HTTP_STATUS_NOT_FOUND
        : http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR
    })
  }

  public static handlerSorter ({ priority: a }: CoreHttpHandler, { priority: b }: CoreHttpHandler) {
    return a === b ? 0 : (a > b ? -1 : 1)
  }

  public listen () {
    this.handlers.sort(CoreHttp.handlerSorter)
    this.server.listen(this.port)
  }

  private static get certs (): { key: Buffer, cert: Buffer, passphrase: string | undefined } {
    return {
      key: readFileSync(process.properties?.http.secure?.key ?? './.cert/key.pem'),
      cert: readFileSync(process.properties?.http.secure?.cert ?? './.cert/cert.pem'),
      passphrase: process.properties?.http.secure?.passphrase
    }
  }

  public get (path: CoreHttpPath, handler: CoreHttpFunction, options?: CoreHttpHandlerOptions): this {
    this.handlers.push(new CoreHttpHandler('GET', path, handler, options))
    return this
  }

  public post (path: CoreHttpPath, handler: CoreHttpFunction, options?: CoreHttpHandlerOptions): this {
    this.handlers.push(new CoreHttpHandler('POST', path, handler, options))
    return this
  }

  public patch (path: CoreHttpPath, handler: CoreHttpFunction, options?: CoreHttpHandlerOptions): this {
    this.handlers.push(new CoreHttpHandler('PATCH', path, handler, options))
    return this
  }

  public delete (path: CoreHttpPath, handler: CoreHttpFunction, options?: CoreHttpHandlerOptions): this {
    this.handlers.push(new CoreHttpHandler('DELETE', path, handler, options))
    return this
  }

  public use (user: (this: CoreHttp) => void): this {
    user.call(this)
    return this
  }
}