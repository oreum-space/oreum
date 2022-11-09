import CoreHttpRouter from '../../core/http/core-http-router'

export default new CoreHttpRouter('/profile')
  .get('/ping', (request) => request.data(undefined, undefined, 'pong'))