import Oreum from './oreum'
import { OreumCacheLevel } from './oreum/cache'

function sleep (ms: number): Promise<void> {
  return new Promise<void>(_ => setTimeout(_, ms))
}

new Oreum()
  .use('test', {
    create (oreum) {
      const { http } = oreum

      http.get(() => true, async (request, response) => {
        return await response.static('/', request.path, './app-dist/', OreumCacheLevel.CACHE_RAM)
      }, {
        priority: -128
      })

      http.get(() => true, (request, response) => {
        return response.file('./app-dist/index.html', OreumCacheLevel.CACHE_RAM)
      }, {
        priority: -256
      })

      http.get('/json', (request, response) => {
        return response.json({
          'json': true,
          date: new Date(),
          number: 42,
          string: 'Hello world!'
        })
      })

      http.get('/oreum-request', (request, response) => {
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
  })
  .done()