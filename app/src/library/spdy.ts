export type SpeedyMethod =
  'GET' |
  'PUT' |
  'POST' |
  'HEAD' |
  'PATCH' |
  'DELETE' |
  'OPTIONS'

class SpeedyRequest<ResponseBody = unknown> {
  public method: SpeedyMethod
  public url: string
  public body: BodyInit | null
  public options?: SpeedyOptions | undefined

  constructor (method: SpeedyMethod, url: string, body?: BodyInit, options?: SpeedyOptions) {
    this.method = method
    this.url = url
    this.body = body ?? null
    this.options = options
  }
}

const WITHOUT_BODY_REQUESTS = ['GET', 'HEAD'] as Readonly<Array<SpeedyMethod>>

class SpeedyResponse<ResponseBody = unknown> {
  public request: SpeedyRequest<ResponseBody>
  readonly #promiseResponse: Promise<Response>

  constructor (request: SpeedyRequest) {
    this.request = request

    console.log('signal 0')
    const controller = new AbortController()
    const signal = controller.signal
    console.log('signal 1')

    signal.onabort = function (event) {
      console.log('fetch aborted event', event)
    }

    console.log('signal 2')

    this.#promiseResponse = fetch(request.url, {
      method: request.method,
      body: WITHOUT_BODY_REQUESTS.includes(request.method) ? null : request.body,
      signal
    })
    console.log('signal 3')
  }

  static #utf8decoder = new TextDecoder()

  public get response () {
    return this.#promiseResponse
  }

  public async *streamJson () {
    const response = await this.response
    console.log('from *streamJson:', response.body)
    if (!response.body) {
      throw new Error()
    }
    const reader = response.body.getReader()
    let read = await reader.read()
    let data = SpeedyResponse.#utf8decoder.decode(read.value)

    while (!read.done) {
      await new Promise(_ => requestAnimationFrame(_))
      read = await reader.read()
      const newData = SpeedyResponse.#utf8decoder.decode(read.value)
      if (newData) {
        data += SpeedyResponse.#utf8decoder.decode(read.value)
        console.log('from *streamJson read:', data)
        yield data
      }
    }

    console.log('from *streamJson data:', data)

    return data
  }

  public async json (): Promise<ResponseBody>  {
    const response = await this.response
    return (await response.json() as ResponseBody)
  }
}

interface SpeedyOptions {
}

const DEFAULT_METHOD: SpeedyMethod = 'GET'
const DEFAULT_TYPE = 'application/octet-stream'

function spdy <ResponseBody = unknown>(url: string): SpeedyResponse<ResponseBody>
function spdy <ResponseBody = unknown>(method: SpeedyMethod, url: string, body?: BodyInit, options?: SpeedyOptions): SpeedyResponse<ResponseBody>
function spdy <ResponseBody = unknown>(method_or_url: SpeedyMethod | string, url?: string, body?: BodyInit, options?: SpeedyOptions): SpeedyResponse<ResponseBody> {
  return new SpeedyResponse<ResponseBody>(new SpeedyRequest(url ? method_or_url as SpeedyMethod : DEFAULT_METHOD, url || method_or_url, body, options))
}

export default spdy