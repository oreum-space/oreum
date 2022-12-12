import Oreum from './oreum'
import apiModule from './src/api'
import appModule from './src/app'
import discordModule from './src/discord'
import mongooseModule from './src/mongoose'

new Oreum()
  .use('mongoose', mongooseModule)
  .use('discord', discordModule)
  .use('app', appModule)
  .use('api', apiModule)
  .done()
/*   .use('test', {
    create (oreum) {
      const { http } = oreum

      const appGroup = new OreumHttpGroup('/', {
        authority: oreum.properties.http.options?.appAuthorities,
        origin: true
      })

      appGroup.get('/ping', async (request, response) => {
          return response.json({
            from: 'application',
            message: 'Hello world!'
          })
        }
      )

      const apiGroup = new OreumHttpGroup('/', {
        authority: oreum.properties.http.options?.apiAuthorities,
        origin: true
      })

      apiGroup.get('/ping', async (request, response) => {
        return response.json({
          from: 'api',
          message: 'Hello world!'
        })
      })

      http.group(appGroup)
      http.group(apiGroup)

      appGroup.get(() => true, async (request, response) => {
        return await response.static('/', request.path, './app-dist/', OreumCacheLevel.CACHE_RAM)
      }, {
        priority: -128
      })

      appGroup.get(() => true, (request, response) => {
        return response.file('./app-dist/index.html', OreumCacheLevel.CACHE_RAM)
      }, {
        priority: -256
      })

      apiGroup.get('/', (request, response) => {
        return response.json({
          'json': true,
          date: new Date(),
          number: 42,
          string: 'Hello world!'
        })
      })

      apiGroup.get('/oreum-request', (request, response) => {
        return response.oreumJson({
          steps: ['step-1', 'step-2', 'step-3'],
          actions: ['', '', ''],
          errors: ['', '', ''],
          async *generator () {
            await sleep(500)
            console.log('step-1')
            yield 'step-1'
            await sleep(500)
            console.log('step-2')
            yield 'step-2'
            await sleep(500)
            console.log('step-3')
            yield 'step-3'
            await sleep(500)
            console.log('return-4')

            return {
              'json': true,
              date: new Date(),
              number: 42,
              string: 'Hello world!'
            }
          }
        })
      })
    }
  }) */