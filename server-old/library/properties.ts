import * as fs from 'fs'

type ProcessProperties = {
  http: {
    port: number,
    secure: {
      cert: string,
      key: string,
      passphrase?: string
    }
  },
  mongoose: {
    url: string
  }
}

declare global {
  namespace NodeJS {
    interface Process {
      properties: ProcessProperties
    }
  }
}

void function () {
  process.properties = JSON.parse(fs.readFileSync('./server/properties.json').toString())
}()