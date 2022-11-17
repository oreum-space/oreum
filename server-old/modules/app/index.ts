import CoreHttp from '../../core/core-http'
import CoreHttpModule from '../../core/core-http-module'
import CoreHttpRequest from '../../core/http/core-http-request'
import * as output from '../../library/output'
import sleep from '../../library/sleep'

class AppModule {
  static #encoder = new TextEncoder()
  static #decoder = new TextDecoder()

  static async getString (request: CoreHttpRequest) {
    return request.data({
      ':status': 200,
      'content-type': 'text/html;charset=utf-8'
    }, {}, '<h1>Hello world!</h1>')
  }

  static async getSuccess (request: CoreHttpRequest) {
    return request.respond({
      ':status': 200,
      'content-type': 'text/html;charset=utf-8'
    }, {
      endStream: true
    })
  }

  static async getAppAssets (request: CoreHttpRequest): Promise<CoreHttpRequest | undefined> {
    return request.static('./app-dist', {
      cache: 1,
      skip: true
    })
  }

  static async getApp (request: CoreHttpRequest) {
    if (!request.path.split('?')[0].includes('.')) {
      return request.file('./app-dist/index.html', {
        cache: 1,
        afterRead: (buffer, mtime) => Buffer.from(AppModule.#decoder.decode(buffer).replace('$build-timestamp',mtime.toUTCString()), 'utf-8')
      })
    }
  }

  static async *#getTest (buffers: Array<Uint8Array>) {
    for (let i = 0; i < buffers.length; i++) {
      await sleep(Math.random() * 250)
      yield buffers[i]
    }
  }

  static async getTest (request: CoreHttpRequest) {
    try {
      const buffers = JSON.stringify({
        data: {
          from: 'server',
          date: new Date().toUTCString(),
          version: 15,
          stream: true
        }
      }, undefined, '\t').split(/(")/g).map(_ => AppModule.#encoder.encode(_))

      request.stream.respond({
        'content-length': buffers.reduce((_, $) => _ + $.length, 0),
        'content-type': 'application/json',
        'oreum-stream': 'true',
        'oreum-frames': '',
        'oreum-errors': 'canceled-by-server'
      }, {
        endStream: false
      })
      console.log('responded')

      for await (const buffer of AppModule.#getTest(buffers)) {
        console.log('writing:', AppModule.#decoder.decode(buffer))
        request.stream.write(buffer)
      }
      console.log('ending')

      return request.end()
    } catch (error) {
      if (error instanceof Error) {
        console.error('getTest error:')
        console.error(error.message)
      }
    }
  }

  static log (text: string | Array<string>) {
    output.log('app', text)
  }
}

export default new CoreHttpModule('application', {
  httpCreate (coreModule: CoreHttpModule, coreHttp: CoreHttp): void | Promise<void> {
    coreHttp
      .get('/test', AppModule.getTest)
      .get(/\/*/, AppModule.getAppAssets, { priority: -1 })
      .get('/', AppModule.getApp, { priority: 1000 - 7 })
      .get(path => !path.startsWith('/api'), AppModule.getApp, { priority: -2})
  }
})