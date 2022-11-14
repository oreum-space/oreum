import type CoreHttp from '../../core/core-http'
import type CoreHttpRequest from '../../core/http/core-http-request'

export default function (this: CoreHttp): void {
  this
    .post('/api/new-account', async function (request): Promise<CoreHttpRequest> {
      try {
        const body = await request.bodyJson()

        return request.json({ ...body, credential: 'Oreum was here!' })
      } catch (error) {
        return request
      }
    })
}