import type Oreum from '../../oreum'
import OreumHttpGroup from '../../oreum/http/group'
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

const invitePaths = ['/invite', '/redirect', '/join']

const discordModule: OreumModuleOptions = {
  create (oreum) {
    try {
      getProperties(oreum)

      if (properties.enabled) {
        const discord = new OreumHttpGroup('/', {
          origin: true,
          authority: properties.authority
        })

        oreum.http.group(discord)

        discord.get('/', (request, response) => {
          response.json({
            json: true,
            invite: properties.invite,
            authority: properties.authority
          })
        })

        discord.get((path) => invitePaths.includes(path), (request, response) => {
          response.redirect(properties.invite)
        })
      }
    } catch (error) {
      console.log('Discord was not loaded!')
    }
  }
}

export default discordModule