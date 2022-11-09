import CoreHttp from '../../core/core-http'
import CoreHttpModule from '../../core/core-http-module'
import CoreHttpRequest from '../../core/http/core-http-request'
import * as output from '../../library/output'
import sleep from '../../library/sleep'
import profile from './profile'

class AppModule {
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
    return request.file('./app-dist/index.html', {
      cache: 1
    })
  }

  static async *_getTest(buffers: Array<Buffer>) {
    for (let i = 0; i < buffers.length; i++) {
      await sleep(Math.random() * 300)
      yield buffers[i]
    }
    return
  }

  static async getTest (request: CoreHttpRequest) {
    const buffers = [...'Hello world!'].map(_ => Buffer.from(_, 'utf8'))
    request.respond(undefined, {
      endStream: false,
      waitForTrailers: true
    })
    request.stream.on('wantTrailers', () => {
      request.stream.sendTrailers({
        ':status': 200,
        'content-length': buffers.reduce((a, { length }) => a + length, 0)
      })
    })
    for await (const buffer of AppModule._getTest(buffers)) {
      request.stream.write(buffer, 'utf-8')
      output.info('sending:', buffer.toString('utf-8'))
    }
    request.stream.close()
    return request
  }

  static log (text: string | Array<string>) {
    output.log('app', text)
  }
}

export default new CoreHttpModule('application', {
  httpCreate (coreModule: CoreHttpModule, coreHttp: CoreHttp): void | Promise<void> {
    coreHttp.get('/string', AppModule.getString)
    coreHttp.get('/success', AppModule.getSuccess)
    coreHttp.get('/test', AppModule.getTest)
    coreHttp.get(/\/*/, AppModule.getAppAssets, { priority: -1 })
    coreHttp.get(/\/*/, AppModule.getApp, { priority: -2 })
    coreHttp.use(profile)
  }
})