<template>
  <ui-card>
    <h1 id="buttons">
      Switcher
    </h1>
    <ui-table-accordion>
      <template #caption>
        &lt;ui-switcher&gt;&lt;/ui-switcher&gt;
      </template>
      <thead>
        <tr>
          <th
            v-for="seriousness of switchSeriousness"
            :key="seriousness"
          >
            {{ seriousness }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td
            v-for="seriousness of switchSeriousness"
            :key="seriousness"
          >
            <ui-switch
              v-model="value"
              :seriousness="seriousness"
              :disabled="disabled"
            />
          </td>
        </tr>
      </tbody>
    </ui-table-accordion>
  </ui-card>
</template>

<script
  setup
  lang="ts"
>
import UiTableAccordion from '@/components/ui/table/UiTableAccordion.vue'
import UiCard from '@/components/ui/UiCard.vue'
import UiSwitch from '@/components/ui/UiSwitch.vue'
import { ref } from 'vue'

const switchSeriousness = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'passive'] as const
const value = ref<boolean>(false)
const disabled = ref<boolean>(false)
</script>

<style
  lang="scss"
  scoped
>

</style>