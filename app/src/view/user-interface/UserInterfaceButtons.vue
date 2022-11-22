<template>
  <ui-card>
    <h1 id="buttons">
      Buttons
    </h1>
    <ui-table-accordion>
      <template v-slot:caption>
        &lt;ui-button&gt;&lt;/ui-button&gt;
      </template>
      <thead>
        <tr>
          <ui-table-cell-diagonal
            column-text="appearance"
            row-text="seriousness"
          />
          <th v-once v-for="seriousness of buttonSeriousness">
            {{ seriousness }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-once v-for="appearance of buttonAppearance">
          <td>
            {{ appearance || 'unset' }}
          </td>
          <td v-once v-for="seriousness of buttonSeriousness">
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
    </ui-table-accordion>
  </ui-card>
</template>

<script
  setup
  lang="ts"
>
import UiTableAccordion from '@/components/ui/table/UiTableAccordion.vue'
import UiTableCellDiagonal from '@/components/ui/table/UiTableCellDiagonal.vue'
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