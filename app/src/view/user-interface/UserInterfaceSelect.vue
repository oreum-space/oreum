<template>
  <ui-card>
    <div class="d-flex g2">
      <ui-select
        v-model="value"
        :options="options"
        label="Select"
      />
      <ui-button
        seriousness="secondary"
        appearance="text"
        @click="value = undefined"
      >
        Reset
      </ui-button>
    </div>
    <div class="d-flex g2">
      <ui-select
        v-model="valueLong"
        :options="optionsLong"
        label="Select long"
      />
      <ui-button
        seriousness="secondary"
        appearance="text"
        @click="valueLong = undefined"
      >
        Reset
      </ui-button>
    </div>
    <div class="d-flex g2">
      <ui-select
        v-model="valueSmall"
        :options="optionsSmall"
        label="Select with small amount"
      />
      <ui-button
        seriousness="secondary"
        appearance="text"
        @click="valueSmall = undefined"
      >
        Reset
      </ui-button>
    </div>
    <div class="d-flex g2">
      <ui-select
        v-model="valueWithOption"
        :options="optionsWithOption"
        label="Select with default option"
      />
      <ui-button
        seriousness="secondary"
        appearance="text"
        @click="valueWithOption = undefined"
      >
        Reset
      </ui-button>
    </div>
    <ui-select
      label="Select empty"
    />
    <ui-select
      label="Select disabled"
      disabled
    />
    <ui-input-color
      model-value="#999999"
    />
    <ui-input-color
      model-value="#99999980"
    />
  </ui-card>
</template>

<script
  setup
  lang="ts"
>
import UiInputColor from '@/components/ui/input/color/UiInputColor.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiCard from '@/components/ui/UiCard.vue'
import UiSelect from '@/components/ui/UiSelect.vue'
import { ref } from 'vue'

const options = new Array(32).fill(null).map((value, index) => `Option ${index}`)
const value = ref<string>()
const optionsLong = new Array(32).fill(null).map((value, index) => `[${index}] Option with long long long string`)
const valueLong = ref<string>()
const optionsSmall = new Array(2).fill(null).map((value, index) => `Option ${index}`)
const valueSmall = ref<string>()
const optionsWithOption = new Array(4).fill(null).map((value, index) => `Option ${index}`)
const valueWithOption = ref<string | undefined>(optionsWithOption[0])
</script>

<style
  lang="scss"
  scoped
>

</style>