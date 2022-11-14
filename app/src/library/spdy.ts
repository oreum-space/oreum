type SpeedyResponseType =
  'stream;plain/text'

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
  request: SpeedyRequest<ResponseBody>
  promiseResponse: Promise<Response>

  constructor (request: SpeedyRequest) {
    this.request = request
    this.promiseResponse = fetch(request.url, {
      method: request.method,
      body: WITHOUT_BODY_REQUESTS.includes(request.method) ? null : request.body
    })
  }

  async json (): Promise<ResponseBody>  {
    const response = await this.promiseResponse
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