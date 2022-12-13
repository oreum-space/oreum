import { OreumCacheLevel } from '../../oreum/cache'
import { OreumModuleOptions } from '../../oreum/module'

const faviconModule: OreumModuleOptions = {
  create (oreum) {
    oreum.http.get('/favicon.ico', (request, response) => {
      return response.file('./app-dist/favicon.ico')
    }, {
      priority: -256
    })

    oreum.http.get((path) => {
      console.log(path)
      return path.startsWith('/favicons/') && path.endsWith('.svg')
    }, async (request, response) => {
      return await response.static('/favicons/', request.path, './app-dist/favicons/', OreumCacheLevel.CACHE_RAM)
    }, {
      priority: -128
    })
  }
}

export default faviconModule