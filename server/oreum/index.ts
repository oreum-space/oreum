import { readFileSync, statSync } from 'fs'
import OreumCache from './cache'
import OreumHttp from './http'
import OreumModule, { OreumModuleOptions } from './module'
import OreumPrompt from './prompt'
import OreumSocket from './socket'

interface OreumProperties {
  http: {
    port: number
    key: string
    cert: string
    options?: {
      allowHTTP1?: false,
      origins?: []
    }
  }
  modules?: Record<string, unknown>
}

type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>
} : T

export default class Oreum {
  readonly #properties: OreumProperties
  readonly #modules: Array<OreumModule> = []
  readonly #prompt: OreumPrompt
  readonly #socket: OreumSocket
  readonly #cache: OreumCache
  readonly #http: OreumHttp

  constructor () {
    process.title = `Oreum Server ${process.env.npm_package_version}(${process.version})`
    this.#properties = Oreum.#readProperties()
    this.#prompt = new OreumPrompt(this)
    this.#socket = new OreumSocket(this)
    this.#cache = new OreumCache(this)
    this.#http = new OreumHttp(this)
  }

  static #checkProperties (properties: DeepPartial<OreumProperties>): properties is OreumProperties {
    const errors: Array<string> = []
    const { http } = properties

    if (!http) {
      errors.push('"http" is required field!')
    } else if (typeof http !== 'object') {
      errors.push('"http" field should be object!')
    } else {
      const { port } = http

      if (!port) {
        errors.push('"http.port" is required field!')
      } else if (isNaN(port)) {
        errors.push('"http.port" field should be number!')
      } else if (80 > port || port > 65535) errors.push('"http.port" should in range (80 >= port >= 65535)!')

      for (const key of ['cert', 'key'] as const) {
        const value = http[key]
        try {
          if (!value) {
            errors.push(`"http.${ key }" is required field!`)
          } else if (!statSync(value)?.isFile()) errors.push(`"http.${ key }" field should be path to file!`)
        } catch (error) {
          if (error instanceof Error) {
            if (error.message.startsWith('ENOENT')) {
              errors.push(`"http.${ key }" file not found!\n\t-\t` + error.message)
            } else {
              errors.push(`"http.${ key }" error!\n\t-\t` + error.message)
            }
          } else {
            errors.push('"http.cert" unknown error!\n\t-\t' + error)
          }
        }
      }
    }

    if (errors.length) {
      console.error('"properties.json" errors:\n *\t' + errors.join('\n *\t'))
    }
    return !errors.length
  }

  static #readProperties (): OreumProperties | never {
    try {
      const rawProperties = readFileSync('./server/properties.json', { encoding: 'utf-8' })
      const properties: DeepPartial<OreumProperties> = JSON.parse(rawProperties)

      if (this.#checkProperties(properties)) {
        return properties
      } else {
        process.exit(-1)
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.startsWith('ENOENT')) {
          console.error(`"properties.json" file not found!\n\t-\t` + error.message)
        } else {
          console.error(`"properties.json" error!\n\t-\t` + error.message)
        }
      } else {
        console.error('"properties.json" unknown error!\n\t-\t' + error)
      }
      process.exit(-1)
    }
  }

  public get properties (): OreumProperties {
    return this.#properties
  }

  public get http () {
    return this.#http
  }

  public get cache () {
    return this.#cache
  }

  public get socket () {
    return this.#socket
  }

  public get prompt () {
    return this.#prompt
  }

  public module (name: string, options: OreumModuleOptions): OreumModule {
    return new OreumModule(this, name, options)
  }

  public use (module: string): this
  public use (name: string, options: OreumModuleOptions): this
  public use (module: OreumModule | string, options?: OreumModuleOptions): this {
    this.#modules.push(module instanceof OreumModule ? module : this.module(module, { ...options }))
    return this
  }

  async #done () {
    for (const module of this.#modules) await module.create()
    await this.#http.listen()
    for (const module of this.#modules) await module.mount()
  }

  public done (): void {
    this.#done().then(() => {
      console.clear()
      console.log('Done...')
    })
  }
}