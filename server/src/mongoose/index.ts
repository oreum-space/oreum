import { connect, ConnectOptions } from 'mongoose'
import sleep from '../../library/sleep'
import Oreum from '../../oreum'

type OreumMongooseProperties = {
  url: string
}

let attempts = 0
let properties!: OreumMongooseProperties

async function _connect () {
  try {
    console.log('MongooseModule', attempts ? `Reconnecting... (${ attempts })` : 'Connecting...')
    await connect(properties.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    } as ConnectOptions)
    console.log('MongooseModule', 'Connected successfully!')
  } catch (error) {
    console.warn(':warn Mongoose, Failed to connect!, reconnecting in 5 seconds...')
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

    if (!properties.url) {
      console.error('"properties.json" errors:\n *\t"modules.mongoose.url" required!')
      throw new Error('"modules.mongoose.url" required!')
    }

    await _connect()
  }
}

 /*
export default new class OreumMongoose implements OreumModuleOptions {
  #attempts = 0
  #properties!: OreumMongooseProperties

  static #options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  } as ConnectOptions

  #getProperties (oreum: Oreum): OreumMongooseProperties {
    return oreum.properties?.modules?.['mongoose'] as OreumMongooseProperties || {}
  }

  async #connect (): Promise<void> {
    try {
      console.log('MongooseModule', this.#attempts ? `Reconnecting... (${this.#attempts})` : 'Connecting...')
      await connect(this.#properties.url, OreumMongoose.#options)
      console.log('MongooseModule', 'Connected successfully!')
    } catch (error) {
      console.warn('Mongoose, Failed to connect!, reconnecting in 5 seconds...')
      await sleep(5000)
      this.#attempts++
      await this.#connect()
    }
  }

  public async create (oreum: Oreum): Promise<void> {
    this.#properties = this.#getProperties(oreum)

    if (!this.#properties) {
      console.error('"properties.json" errors:\n *\t"modules.mongoose" required!')
      throw new Error('"modules.mongoose" required!')
    }

    if (!this.#properties.url) {
      console.error('"properties.json" errors:\n *\t"modules.mongoose.url" required!')
      throw new Error('"modules.mongoose.url" required!')
    }

    await this.#connect()
  }
}*/
