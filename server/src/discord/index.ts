import type Oreum from '../../oreum'
import { OreumModuleOptions } from '../../oreum/module'

type OreumDiscordProperties = {
  enabled: boolean,
  invite: string,
  authority: Array<string>,
  appid: string,
  guild: string,
  token: string,
  key: string
}

let properties!: OreumDiscordProperties

function getProperties (oreum: Oreum) {
  if (!oreum.properties?.modules?.['discord']) {
    throw new Error('"properties.json modules.discord is required!"')
  }
  properties = oreum.properties.modules['discord'] as OreumDiscordProperties
}

const discordModule: OreumModuleOptions = {
  create (oreum) {
    try {
      getProperties(oreum)

      if (properties.enabled) {
        oreum.http.get('/', (request, response) => {
          response.redirect(properties.invite)
        }, {
          origin: false,
          authority: properties.authority
        })
      }
    } catch (error) {
      console.log('Discord was not loaded!')
    }
  }
}

export default discordModule