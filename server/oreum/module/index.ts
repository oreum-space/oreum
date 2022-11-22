import type Oreum from '../index'

interface OreumModuleProperties extends Record<string, any> {
  readonly disabled?: boolean
}

export interface OreumModuleOptions {
  create? (oreum: Oreum): Promise<void> | void
  mount? (oreum: Oreum): Promise<void> | void
  destroy? (oreum: Oreum): Promise<void> | void
}

export default class OreumModule {
  #disabled: boolean
  readonly #properties?: OreumModuleProperties
  readonly #options: OreumModuleOptions
  readonly #oreum: Oreum

  constructor (oreum: Oreum, name: string, options: OreumModuleOptions) {
    this.#oreum = oreum
    this.#options = options
    this.#properties = oreum.properties?.modules?.[name] as OreumModuleProperties
    this.#disabled = this.#properties?.disabled || false
  }

  create (): Promise<void> | void {
    return this.#options.create?.(this.#oreum)
  }

  mount (): Promise<void> | void {
    return this.#options.mount?.(this.#oreum)
  }

  destroy (): Promise<void> | void {
    return this.#options.destroy?.(this.#oreum)
  }

  public get disabled () {
    return this.#disabled
  }

  public disable () {
    this.#disabled = true
  }

  public enable () {
    this.#disabled = false
  }
}