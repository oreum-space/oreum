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

const options = {
  key: fs.readFileSync('./.cert/localhost-privkey.pem'),
  cert: fs.readFileSync('./.cert/localhost-cert.pem'),
}

const server = http2.createSecureServer(options)

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
}

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

server.on('stream', (stream) => {
  stream.respond({ http }, { waitForTrailers: true })
  stream.end('some data');
});

server.listen(443)