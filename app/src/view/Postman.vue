<template>
  <main class="app-postman">
    <h1 class="mb4">
      Postman
    </h1>
    <ui-card>
      <div class="ui-input-inline">
        <ui-button
          v-for="m of methods"
          size="small"
          :key="m"
          :seriousness="m === method ? 'primary' : 'passive'"
          @click="method = m"
        >
          <code style="font-size: 14px">
            {{ m }}
          </code>
        </ui-button>
      </div>
      <ui-input-text
        class="flex-grow"
        width="480px"
        label="Url"
        v-model="url"
      />
      <ui-input-textarea
        label="Request Body"
        v-model="requestBody"
        code
      />
      <ui-input-textarea
        label="Response body"
        v-model="responseBody"
        code
        disabled
      />
      <code>
        last: {{ lastResponseTime.toLocaleTimeString() }} {{ lastResponseStatus }}<br>
      </code>
      <table v-if="responseHeaders.length" style="border: 1px solid white; border-collapse: collapse; width: fit-content">
        <caption style="border: 1px solid white">
          <h3>
            Response Headers
          </h3>
        </caption>
        <thead>
          <tr>
            <th style="border: 1px solid white; border-collapse: collapse; padding: 2px 4px">
              key
            </th>
            <th style="border: 1px solid white; border-collapse: collapse; padding: 2px 4px">
              value
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="header of responseHeaders" :key="header[0]">
            <td style="border: 1px solid white; border-collapse: collapse; padding: 2px 4px">
              {{ header[0] }}
            </td>
            <td style="border: 1px solid white; border-collapse: collapse; padding: 2px 4px">
              {{ header[1] }}
            </td>
          </tr>
        </tbody>
      </table>
      <ui-button
        :disabled="sending"
        @click="send"
      >
        {{ sending ? 'Sending' : 'Send' }}
      </ui-button>
    </ui-card>
  </main>
</template>

<script
  setup
  lang="ts"
>
import UiInputText from '@/components/ui/input/UiInputText.vue'
import UiInputTextarea from '@/components/ui/input/UiInputTextarea.vue'
import UiButton from '@/components/ui/UiButton.vue'
import spdy, { SpeedyMethod } from '@/library/spdy'
import { computed, ref, WritableComputedRef } from 'vue'
import UiCard from "@/components/ui/UiCard.vue";

const methods = [
  'GET',
  'PUT',
  'POST',
  'HEAD',
  'PATCH',
  'DELETE',
  'OPTIONS'
] as Readonly<Array<SpeedyMethod>>

function localRef(key: string, value: string) {
  const l = localStorage.getItem(key)
  const _ = ref<string>(l || value)
  return computed<string>({
    get () {
      return _.value
    },
    set (value: string): void {
      localStorage.setItem(key, value)
      _.value = value
    }
  })
}

const method = localRef('postman:method', methods[0]) as WritableComputedRef<SpeedyMethod>
const url = localRef('postman:url', 'https://localhost/api/')
const requestBody = localRef('postman:requestBody', '{\n  \n}')
const previousRequestBody = ref<string>('')
const sending = ref<boolean>(false)
const responseBody = ref<string>('')
const lastResponseTime = ref<Date>(new Date())
const lastResponseStatus = ref<number>(999)
const responseHeaders = ref<Array<[string, string]>>([])

async function send () {
  sending.value = true
  previousRequestBody.value = requestBody.value
  try {
    const request = spdy(method.value, url.value, requestBody.value)
    const response = await request.response

    const $responseHeaders: Array<[string, string]> = []
    for (const entry of response.headers.entries()) $responseHeaders.push(entry)
    responseHeaders.value = $responseHeaders

    lastResponseStatus.value = response.status

    const contentType = response.headers.get('content-type')
    const isStream = response.headers.get('oreum-stream') === 'true'

    if (contentType) {
      if (contentType.startsWith('application/json')) {
        if (isStream) {
          const iterator = request.streamJson()
          for await (const response of iterator) {
            console.log('stream:', response)
            responseBody.value = response
          }
        } else {
          const json = await request.json()
          console.info('json:', json)
          responseBody.value = JSON.stringify(json, undefined, 2)
        }
      } else if (contentType.includes('text/')) {
        const text = await response.text()
        console.info('text:', text)
        responseBody.value = text
      }
    } else {
      const blob = await response.blob()
      console.log('blob')
      responseBody.value = await blob.text()
    }

    console.log('response:', response)

  } catch (error) {
    console.log('catch')
    if (error instanceof Error) {
      lastResponseStatus.value = 499
      responseBody.value = error.message
    }
    console.dir(error)
    console.error(error)
  } finally {
    lastResponseTime.value = new Date()
    sending.value = false
  }
}
</script>
