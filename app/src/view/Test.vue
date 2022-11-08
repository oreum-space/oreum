<template>
  <div>
    Home
    <select
      name="method"
      v-model="method"
    >
      <option value="GET">
        GET
      </option>
      <option value="POST">
        POST
      </option>
      <option value="PATCH">
        PATCH
      </option>
      <option value="DELETE">
        DELETE
      </option>
    </select>
    <input
      type="text"
      placeholder="Url"
      v-model="url"
      list="urls"
      name="url"
    >
    <datalist id="urls">
      <option
        v-for="data of datalist"
        :key="data"
        :value="data"
      />
    </datalist>
    <button @click="send">
      Send
    </button>
  </div>
</template>

<script
  setup
  lang="ts"
>
import { ref } from 'vue'

const method = ref<string>('GET')
const url = ref<string>('')
const localStorageUrls = localStorage.getItem('urls')
const datalist = ref<Array<string>>(localStorageUrls ? JSON.parse(localStorageUrls) as Array<string> || [] : [])

async function *attempter () {
  for (let i = 0; i < 12; i++) {
    await new Promise((resolve) => setTimeout(resolve, 450))
    yield i
  }
  return -1
}

async function *reader (stream: ReadableStreamDefaultReader<Uint8Array>) {
  let result = ''
  let read = await stream.read()
  while (!read.done) {
    const part = new TextDecoder().decode(read.value)
    if (part) {
      yield (result += part)
    }
    read = await stream.read()
    await new Promise((resolve) => setTimeout(resolve, 10))
  }
  return -1
}


function send () {
  if (!datalist.value.includes(url.value)) {
    datalist.value.push(url.value)
    localStorage.setItem('urls', JSON.stringify(datalist.value))
  }

  fetch(url.value)
    .then(async response => {
      console.log('start')
      //const reader = response.body!.getReader()
      for await (const data of reader(response.body!.getReader())) {
        console.log(data)
      }
      //for await (const attempt of attempter()) {
      //  reader.read().then(_ => console.log(`attempt ${attempt}:"`, new TextDecoder().decode(_.value)))
      //}
      console.log('end')

      // reader.read().then(stream => console.log('stream:', stream))

      // for await (const attempt of attempter()) {
      //   reader.read().then(_ => console.log(`attempt ${attempt}:"`, new TextDecoder().decode(_.value)))
      // }
    })

/*   const xhr = new XMLHttpRequest()

  xhr.open(method.value, url.value)
  xhr.onerror = function (error) {
    console.error('XHR onerror!', xhr, error)
  }
  xhr.onloadstart = function (response) {
    console.info('XHR onloadstart!', xhr, response)
    response.target.dispatchEvent('want')
  }
  xhr.onprogress = function (response) {
    console.info('XHR onprogress!', xhr, response)
  }
  xhr.onload = function (response) {
    console.info('XHR onload!', xhr, response)
  }
  xhr.onloadend = function (response) {
    console.info('XHR onloadend!', xhr, response)
  }
  xhr.send('{ data: "Request body!" }') */

}
</script>

<style
  lang="scss"
  scoped
>

</style>