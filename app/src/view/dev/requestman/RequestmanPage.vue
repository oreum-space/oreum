<template>
  <main class="app-main app-main__requestman requestman">
    <div class="requestman__header">
      <ui-select
        v-model="method"
        :options="methods"
      />
      <ui-input-text
        v-model="url"
        label="Request URL"
      />
      <ui-async-button
        seriousness="info"
        size="large"
      >
        Send
      </ui-async-button>
    </div>
    <div class="requestman__tabs mta">
      <ui-button
        appearance="text"
      >
        Headers
      </ui-button>
    </div>
  </main>
</template>

<script
  setup
  lang="ts"
>
import UiInputText from '@/components/ui/input/UiInputText.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiSelect from '@/components/ui/UiSelect.vue'
import UiAsyncButton from '@/components/UiAsyncButton.vue'
import { ref } from 'vue'

const methods = ['GET', 'PUT', 'POST', 'HEAD', 'PATCH', 'DELETE', 'OPTIONS']

const url = ref<string>('')
const method = ref<string>(methods[0])
</script>

<style lang="scss">
.requestman {
  max-height: var(--fvh);

  &__header {
    display: flex;
    gap: var(--app-padding);

    .ui-select {
      --width: 128px;
    }

    .ui-input-text {
      --width: 100%;
    }
  }

  &__tabs {

  }
}
</style>