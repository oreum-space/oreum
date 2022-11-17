const http2 = require('http2');
const fs = require('fs');
const path = require('path');
const mime = require('mime-types');

const {
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_METHOD,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR
} = http2.constants;

function sleep (ms) {
  return new Promise(_ => setTimeout(() => _(), ms))
}

const options = {
  key: fs.readFileSync('./.cert/localhost-privkey.pem'),
  cert: fs.readFileSync('./.cert/localhost-cert.pem'),
}

const server = http2.createSecureServer(options, async (request, response) => {
  console.log(request.url)
  await sleep(250)
  response.stream.respond({
    ':status': 200,
    [http2.constants.HTTP2_HEADER_CONTENT_TYPE]: 'application/json;stream=true',
    [http2.constants.HTTP2_HEADER_CONTENT_LENGTH]: 'Hello world!'.length
  }, {
    endStream: false
  })
  await sleep(250)
  response.stream.write('Hello', 'utf-8')
  await sleep(250)
  response.stream.write(' ', 'utf-8')
  await sleep(250)
  response.stream.write('world!', 'utf-8')
  await sleep(250)
  request.stream.end()
  response.end()
})

/*
const serverRoot = './public'

function respondToStreamError(error, stream) {
  console.error(error)
  if (error.code === 'ENOENT') {
    stream.respond({
      ':status': HTTP_STATUS_NOT_FOUND
    })
  } else {
    stream.respond({
      ':status': HTTP_STATUS_INTERNAL_SERVER_ERROR
    })
  }
  stream.end()
} */
/*
server.on('stream', (stream, headers) => {
  const reqPath = headers[HTTP2_HEADER_PATH]
  const reqMethod = headers[HTTP2_HEADER_METHOD]

  const fullPath = path.join(serverRoot, reqPath)
  const responseMimeType = mime.lookup(fullPath)

  stream.respondWithFile(fullPath, {
    'content-type': responseMimeType
  }, {
    onError: (error) => respondToStreamError(error, stream)
  })
})
*/
/*
server.on('stream', (stream) => {
  stream.respond({ http }, { waitForTrailers: true })
  stream.end('some data');
});
*/

server.listen(443)
console.log('port', 443)