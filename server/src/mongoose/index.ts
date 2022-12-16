import { connect, set, ConnectOptions } from 'mongoose'
import sleep from '../../library/sleep'
import Oreum from '../../oreum'

type OreumMongooseProperties = {
  enabled?: boolean,
  url: string
}

let attempts = 0
let properties!: OreumMongooseProperties

async function _connect () {
  try {
    console.log('MongooseModule', attempts ? `Reconnecting... (${ attempts })` : 'Connecting...')
    set('strictQuery', true)
    await connect(properties.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    } as ConnectOptions)
    console.log('MongooseModule', 'Connected successfully!')
  } catch (error) {
    console.warn('Failed to connect!, reconnecting in 5 seconds...')
    await sleep(5000)
    attempts++
    await _connect()
  }
}

function extractProperties (oreum: Oreum): OreumMongooseProperties {
  return oreum.properties?.modules?.['mongoose'] as OreumMongooseProperties || {}
}

export default {
  async create (oreum: Oreum): Promise<void> {
   properties = extractProperties(oreum)

    if (!properties) {
      console.error('"properties.json" errors:\n *\t"modules.mongoose" required!')
      throw new Error('"modules.mongoose" required!')
    }

    if (properties.enabled) {
      if (!properties.url) {
        console.error('"properties.json" errors:\n *\t"modules.mongoose.url" required!')
        throw new Error('"modules.mongoose.url" required!')
      }

      await _connect()
    }
  }
}

