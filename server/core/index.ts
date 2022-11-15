import output from '../library/output'
import CoreModule from './core-module'
import CoreHttp from './core-http'
import CoreHttpModule from './core-http-module'
import CorePrompt from './core-prompt'
import CoreSocket from './core-socket'

type UsableCoreModule = CoreModule | CoreHttpModule

export default class Core {
  private readonly http: CoreHttp
  private readonly socket: CoreSocket
  private readonly prompt: CorePrompt
  private modules: Array<UsableCoreModule>

  constructor () {
    this.http = new CoreHttp()
    this.socket = new CoreSocket()
    this.prompt = new CorePrompt()
    this.modules = []
  }

  public use (coreModule: UsableCoreModule): this {
    this.modules.push(coreModule)
    return this
  }

  async #mount (): Promise<void> {
    this.#info('Creating...')
    await this.create()
    this.#info('Starting...')
    await this.start()
  }

  public mount (): void {
    this
      .#mount()
      .then(() => {
        this.#info([
          'Successfully mounted!',
          `➜  Local: https://localhost${
            process.properties.http.port !== 443 ? ':' + process.properties.http.port : ''
          }`
        ])
        let a = ''
        let b = process.stdout.rows - 4
        while (b--) {
          a += '\n'
        }
        output.raw(new Array(process.stdout.rows - 4).fill('\n').join('') + '\x1B[4;0H')
      })
  }

  private async create (): Promise<this> {
    for (const module of this.modules) {
      try {
        if (module instanceof CoreHttpModule) {
          await module.httpCreate(this.http)
        }
        await module.create()
      } catch (error) {
        module.error('Failed to create!')
        this.modules = this.modules.filter(_ => _.name !== module.name)
        module.error('Module was removed from Core!')
      }
    }

    return this
  }

  private async start (): Promise<this> {
    this.http.listen()

    for (const module of this.modules) {
      try {
        if (module instanceof CoreHttpModule) {
          await module.httpStart(this.http)
        }
        await module.start()
      } catch (error) {
        module.error('Failed to start!')
      }
    }

    return this
  }

  /* private async destroy (): Promise<this> {
    for (const module of this.modules) {
      try {
        if (module instanceof CoreHttpModule) {
          await module.httpDestroy(this.http)
        }
        await module.destroy()
      } catch (error) {
        module.error('Failed to destroy!')
      }
    }

    return this
  } */

  #info (messages: string | Array<string>): this {
    output.info('core', messages)
    return this
  }

  /*
  #log (messages: string | Array<string>): this {
    log('core', messages)
    return this
  }

  #warning (messages: string | Array<string>): this {
    warning('core', messages)
    return this
  }

  #error (messages: string | Array<string>): this {
    error('core', messages)
    return this
  }
  */

  public static new (): Core {
    return new Core()
  }
}