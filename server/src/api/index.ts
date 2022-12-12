import Oreum from '../../oreum'
import OreumHttpGroup from '../../oreum/http/group'
import { OreumModuleOptions } from '../../oreum/module'
import { AuthorityModule } from '../types'

const apiModule: OreumModuleOptions = {
  create (oreum: Oreum) {
    const api = new OreumHttpGroup('/', {
      authority: (oreum.properties.modules?.api as AuthorityModule)?.authority,
      origin: true
    })

    oreum.http.group(api)

    api.get('/ping', (request, response) => {
      return response.json({
        from: 'api',
        message: 'Hello world!'
      })
    })
  }
}

export default apiModule