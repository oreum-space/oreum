import { readFileSync } from 'fs'
import http2, { Http2SecureServer, IncomingHttpHeaders, ServerHttp2Stream } from 'http2'
import ErrnoException = NodeJS.ErrnoException
import * as output from './../library/output'
import CoreHttpHandler, { CoreHttpFunction, CoreHttpHandlerOptions } from './http/core-http-handler'
import CoreHttpRouter from './http/core-http-router'
import CoreHttpRequest from './http/core-http-request'

export default class CoreHttp {
  private readonly port: number
  private readonly server: Http2SecureServer
  private readonly handlers: Array<CoreHttpHandler | CoreHttpRouter>

  constructor () {
    this.port = process.properties?.http?.port ?? 443
    this.handlers = []
    this.server = http2.createSecureServer({ ...CoreHttp.certs })
    this.server.on('stream', CoreHttp.onStream.bind(this))
  }

  private static async onStream (this: CoreHttp, stream: ServerHttp2Stream, headers: IncomingHttpHeaders) {
    const request = new CoreHttpRequest(stream, headers)

    try {
      for (const handler of this.handlers) {
        if (await handler.handle(request) instanceof CoreHttpRequest) {
          return
        }
      }
    } catch (error) {
      if (!stream.closed) {
        stream.close(500)
        // stream.respond({
        //   ':status': 500
        // }, {
        //   endStream: true
        // })
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
    for (const handler of this.handlers) {
      if (handler instanceof CoreHttpRouter) {
        handler.sort()
      }
    }
    this.server.listen(this.port)
  }

  private static get certs (): { key: Buffer, cert: Buffer, passphrase: string | undefined } {
    return {
      key: readFileSync(process.properties?.http.secure?.key ?? './.cert/key.pem'),
      cert: readFileSync(process.properties?.http.secure?.cert ?? './.cert/cert.pem'),
      passphrase: process.properties?.http.secure?.passphrase
    }
  }

  public get (path: string | RegExp, handler: CoreHttpFunction, options?: CoreHttpHandlerOptions) {
    this.handlers.push(new CoreHttpHandler('GET', path, handler, options))
  }

  public use (router: CoreHttpRouter) {
    this.handlers.push(router)
  }

  // TODO: post
  // TODO: patch
  // TODO: delete
}