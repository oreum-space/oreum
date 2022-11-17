import { hash } from 'bcrypt'
import { v4 } from 'uuid'
import type CoreHttp from '../../../core/core-http'
import type CoreHttpRequest from '../../../core/http/core-http-request'
import ProfileModel from './profile-model'

export default function (this: CoreHttp): void {
  this
    .post('/api/new-account', async function (request): Promise<CoreHttpRequest | undefined> {
      console.log('api/new-account')
      try {
        request.stream.respond({
          ':status': 200,
          'content-type': 'application/json',
          'content-length': 'unknown',
          'oreum-stream': 'true',
          'oreum-frames': JSON.stringify([
            'reading-body',
            'checking-username',
            'checking-email',
            'sending-message'
          ])
        }, {
          endStream: false
        })
        const { username, email, password: rawPassword } = await request.bodyJSON()
        request.stream.write('\r')
        const field: Record<string, string> = {}
        let action: string | undefined = undefined

        if (!username) {
          field.username = 'required'
          action = 'focus:username'
        }
        if (!email) {
          field.email = 'required'
          action = 'focus:email'
        }
        if (!rawPassword) {
          field.password = 'required'
          action = 'focus:password'
        }

        if (field) {
          return request.badRequest({ error: 'bad-request', field, action })
        }

        if (await ProfileModel.findOne({ username })) {
          return request.badRequest({
            error: 'already-exist-username',
            field: 'username',
            action: 'focus:username'
          })
        }

        if (await ProfileModel.findOne({ email })) {
          return request.badRequest({
            error: 'already-exist-email',
            field: 'email',
            action: 'focus:email'
          })
        }

        const uuid = v4()
        const password = await hash(rawPassword, 3)
        const activation = {
          link: uuid,
          code: parseInt(uuid, 16).toString().slice(-6).padStart(6, '0'),
          hash: v4(),
          left: 3
        }

        return request.stream.closed ? request : request.json({ username, email, password, test: 'red' })
      } catch (error: unknown) {
        if (request.closeIfBodyJsonError(error)) return request
        throw error
      }
    })
}
