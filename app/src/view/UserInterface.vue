<template>
  <ui-card>
    <h1 id="buttons">
      Buttons
    </h1>
    <table v-once>
      <thead>
        <tr>
          <th />
          <th v-for="seriousness of buttonSeriousness">
            {{ seriousness }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="appearance of buttonAppearance">
          <td>
            {{ appearance }}
          </td>
          <td v-for="seriousness of buttonSeriousness">
            <ui-button
              :appearance="appearance"
              :seriousness="seriousness"
              size="small"
            >
              text
            </ui-button>
          </td>
        </tr>
      </tbody>
    </table>
  </ui-card>
</template>

<script
  setup
  lang="ts"
>
import UiButton from '@/components/ui/UiButton.vue'
import UiCard from '@/components/ui/UiCard.vue'

const buttonSeriousness = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'passive'] as const
const buttonAppearance = ['', 'text', 'outlined', 'rounded', 'rounded-outlined', 'rounded-text'] as const
</script>

<style
  lang="scss"
  scoped
>

</style>