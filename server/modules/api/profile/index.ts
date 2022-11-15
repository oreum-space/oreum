import type CoreHttp from '../../../core/core-http'
import type CoreHttpRequest from '../../../core/http/core-http-request'

export default function (this: CoreHttp): void {
  this
    .post('/api/new-account', async function (request): Promise<CoreHttpRequest | undefined> {
      console.log('api/new-account')
      try {
        const { username, email, password } = await request.bodyJSON()
        const errors: Record<string, string> = {}
        const actions: Record<string, string> = {}

        if (!username) errors.username = 'required'
        if (!email) errors.email = 'required'
        if (!password) errors.password = 'required'

        if (errors) {
          return request.badRequest({ errors, actions })
        }

        return request.stream.closed ? request : request.json({ username, email, password, test: 'red' })
      } catch (error: unknown) {
        if (request.closeIfBodyJsonError(error)) return request
        throw error
      }
    })
}
