import CoreHttp from '../../core/core-http'
import output from '../../library/output'

function _ (path: TemplateStringsArray) {
  return '/profile/' + path[0]
}

export default function (this: CoreHttp) {
  this
    .get(_`ping`, (request) => {
      return request.data(undefined, undefined, 'pong')
    })
    .post(_`new-account`, async (request) => {
      try {
        console.log(request)
      } catch (error) {
        if (error instanceof Error) {
          output.error('module-app-profile', error.message)
        }
      }
      return request.data(undefined, undefined, 'pong')
    })
}
