import CoreModule, { CoreModuleOptions } from '../../core/core-module'
import { connect, ConnectOptions } from 'mongoose'
import output from '../../library/output'
import sleep from '../../library/sleep'

class CoreMongooseModule extends CoreModule {
  private attempts = 0
  private url = process.properties?.mongoose?.url
  private static options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  } as ConnectOptions

  constructor (name: string, options: CoreModuleOptions<CoreMongooseModule>) {
    super(name, options)
  }

  public async connect (): Promise<void> {
    if (!this.url) {
      throw new Error('properties.mongoose.url are required!')
    }

    try {
      output.info('core-mongoose-module', this.attempts ? `Reconnecting... (attempt: ${this.attempts})` : 'Connecting...')
      await connect(this.url, CoreMongooseModule.options)
      await sleep(1000)
      output.raw('\x1B[F')
      output.info('core-mongoose-module', 'Connected successfully!')
    } catch (error) {
      output.warning('core-mongoose-module', 'Failed to connect!, reconnecting in 5 seconds...')
      await sleep(5000)
      this.attempts++
      await this.connect()
    }
  }
}

export default new CoreMongooseModule('mongoose', {
  async create (coreModule) {
    await coreModule.connect()
  }
})