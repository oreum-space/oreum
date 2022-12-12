import { OreumCacheLevel } from '../../oreum/cache'
import OreumHttpGroup from '../../oreum/http/group'
import { OreumModuleOptions } from '../../oreum/module'
import { AuthorityModule } from '../types'

const appModule: OreumModuleOptions = {
  create (oreum) {
    const app = new OreumHttpGroup('/', {
      authority: (oreum.properties.modules?.app as AuthorityModule)?.authority,
      origin: true
    })

    oreum.http.group(app)

    app.get(() => true, async (request, response) => {
      return await response.static('/', request.path, './app-dist/', OreumCacheLevel.CACHE_RAM)
    }, {
      priority: -128
    })

    app.get(() => true, (request, response) => {
      return response.file('./app-dist/index.html', OreumCacheLevel.CACHE_RAM)
    }, {
      priority: -256
    })

    app.get('/ping', (request, response) => {
      return response.json({
        from: 'app',
        message: 'Hello world!'
      })
    })
  }
}

export default appModule