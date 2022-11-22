import { readFile, stat, Stats } from 'fs'
import { gzip } from 'zlib'

export default class OreumCacheFile {
  readonly #path: string
  #buffer!: Uint8Array
  #modified = new Date(0)
  #promise: Promise<this> | null = null

  constructor (path: string) {
    this.#path = path
  }

  get buffer () {
    return this.#buffer
  }

  get path () {
    return this.#path
  }

  static #gzip (buffer: Uint8Array): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      gzip(buffer, { level: 6 }, (error: (Error | null), result: Buffer) => {
        if (error) return reject(error)
        resolve(result)
      })
    })
  }

  get modifiedDate () {
    return this.#modified
  }

  static #stat (path: string): Promise<Stats> {
    return new Promise<Stats>((resolve, reject) => {
      stat(path, (error, stats) => {
        if (error) return reject(error)
        resolve(stats)
      })
    })
  }

  static #readFile (path: string) {
    return new Promise<Buffer>((resolve, reject) => {
      readFile(path, (error, buffer) => {
        if (error) return reject(error)
        resolve(buffer)
      })
    })
  }

  throwIfNotFile (stats: Stats) {
    if (!stats.isFile()) throw new Error('Is not file!')
  }

  async #get (): Promise<this> {
    try {
      const stats = await OreumCacheFile.#stat(this.#path)
      this.throwIfNotFile(stats)
      if (+this.#modified === +stats.mtime) {
        return this
      }
      this.#modified = stats.mtime
      this.#buffer = await OreumCacheFile.#gzip(await OreumCacheFile.#readFile(this.#path))
      return this
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message, this.#path)
      }
      throw error
    } finally {
      this.#promise = null
    }
  }

  async get (): Promise<this> {
    return await(this.#promise || (this.#promise = this.#get()))
  }
}