const http2 = require('node:http2');
const { readFileSync } = require('fs')
const server = http2.createSecureServer({
  cert: readFileSync('./.cert/cert.pem'),
  key: readFileSync('./.cert/key.pem')
});
server.on('stream', (stream) => {
  stream.respond({
    [http2.constants.HTTP2_HEADER_ACCESS_CONTROL_ALLOW_ORIGIN]: '*',
    [http2.constants.HTTP2_HEADER_CONTENT_TYPE]: 'application/json',
    [http2.constants.HTTP2_HEADER_ACCEPT_RANGES]: 'bytes',
    [http2.constants.HTTP2_HEADER_CONTENT_RANGE]: 'bytes 11-38/38',
    [http2.constants.HTTP2_HEADER_RANGE]: 'bytes 11-38',
    [http2.constants.HTTP2_HEADER_CONTENT_LENGTH]: '38'
  });
  stream.end('not content:{ "text": "Hello world!" }')
});
server.listen(9999);