import type Oreum from '../index'
import OreumCacheFile from './file'

export enum OreumCacheLevel {
  NO_CACHE,
  CACHE_RAM,
  CACHE_FILE,
  CACHE_RAM_ONCE
}

export default class OreumCache {
  #oreum: Oreum
  static readonly #fileStorage: Map<string, OreumCacheFile> = new Map()

  constructor (oreum: Oreum) {
    this.#oreum = oreum
  }

  async file (path: string, level: Exclude<OreumCacheLevel, 0>): Promise<OreumCacheFile> {
    try {
      const fileFromCache = OreumCache.#fileStorage.get(path)

      if (fileFromCache) {
        return OreumCacheLevel.CACHE_RAM_ONCE === level ? fileFromCache : await fileFromCache.get()
      }

      const newFile = await new OreumCacheFile(path).get()
      OreumCache.#fileStorage.set(path, newFile)
      return newFile
    } catch (error) {
      throw error
    }
  }
}