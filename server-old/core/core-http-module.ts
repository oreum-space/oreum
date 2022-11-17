import CoreHttp from './core-http'
import CoreModule, { CoreModuleOptions } from './core-module'

interface CoreExpressModuleOptions extends CoreModuleOptions {
  router?: CoreHttpModule
  httpCreate ?(coreModule: CoreHttpModule, coreHttp: CoreHttp): void | Promise<void>
  httpStart ?(coreModule: CoreHttpModule, coreHttp: CoreHttp): void | Promise<void>
  httpDestroy ?(coreModule: CoreHttpModule, coreHttp: CoreHttp): void | Promise<void>
}

export default class CoreHttpModule extends CoreModule {
  declare protected options: CoreExpressModuleOptions

  constructor (name: string, options: CoreExpressModuleOptions) {
    super(name, options)
  }

  public async httpCreate (coreHttp: CoreHttp): Promise<this> {
    await this.options.httpCreate?.(this, coreHttp)
    return this
  }

  public async httpStart (coreHttp: CoreHttp): Promise<this> {
    await this.options.httpStart?.(this, coreHttp)
    return this
  }

  public async httpDestroy (coreHttp: CoreHttp): Promise<this> {
    await this.options.httpDestroy?.(this, coreHttp)
    return this
  }
}