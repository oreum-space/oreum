import { error, info, log, warning } from '../library/output'

export interface CoreModuleOptions<T = CoreModule> {
  create ?(coreModule: T): void | Promise<void>
  start ?(coreModule: T): void | Promise<void>
  destroy ?(coreModule: T): void | Promise<void>
}

export default class CoreModule {
  public readonly name: string
  protected options: CoreModuleOptions<this>

  constructor (name: string, options: CoreModuleOptions) {
    this.name = name
    this.options = options
  }

  public async create (): Promise<this> {
    await this.options.create?.(this)
    return this
  }

  public async start (): Promise<this> {
    await this.options.create?.(this)
    return this
  }

  public async destroy (): Promise<this> {
    await this.options.destroy?.(this)
    return this
  }

  public info (messages: string | Array<string>): this {
    info('core', messages)
    return this
  }

  public log (messages: string | Array<string>): this {
    log('core', messages)
    return this
  }

  public warning (messages: string | Array<string>): this {
    warning('core', messages)
    return this
  }

  public error (messages: string | Array<string>): this {
    error('core', messages)
    return this
  }
}