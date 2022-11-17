import CoreHttp from '../../core/core-http'
import CoreHttpModule from '../../core/core-http-module'
import profile from './profile'

export default new CoreHttpModule('api', {
  httpCreate (coreModule: CoreHttpModule, coreHttp: CoreHttp): void | Promise<void> {
    coreHttp
      .get('/api/json', request => request.json({ boolean: true, string: 'string', number: 42 }))
      .use(profile)
  }
})