<template>
  <ui-card>
    <h1>
      Inputs
    </h1>
    <ui-input-text
      v-model="inputTextValue"
      label="Input text"
    />
    <ui-input-text
      v-model="inputTextValue"
      label="Input text with datalist"
      :datalist="['data 1', 'data 2']"
    />
    <ui-input-number
      v-model="inputNumberValue"
    />
  </ui-card>
</template>

<script
  setup
  lang="ts"
>
import UiInputNumber from '@/components/ui/input/UiInputNumber.vue'
import UiInputText from '@/components/ui/input/UiInputText.vue'
import UiCard from '@/components/ui/UiCard.vue'
import { ref } from 'vue'

const inputTextValue = ref('value')
const inputNumberValue = ref(0)
</script>

<style
  lang="scss"
  scoped
>

</style>