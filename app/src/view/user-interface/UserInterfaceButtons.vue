<template>
  <ui-card>
    <h1 id="buttons">
      Buttons
    </h1>
    <ui-table-accordion>
      <template #caption>
        &lt;ui-button&gt;&lt;/ui-button&gt;
      </template>
      <thead>
        <tr>
          <ui-table-cell-diagonal
            column-text="appearance"
            row-text="seriousness"
          />
          <th
            v-for="seriousness of buttonSeriousness"
            :key="seriousness"
          >
            {{ seriousness }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="appearance of buttonAppearance"
          :key="appearance"
        >
          <td class="ui-table__col_primary">
            {{ appearance || 'unset' }}
          </td>
          <td
            v-for="seriousness of buttonSeriousness"
            :key="seriousness"
          >
            <ui-button
              :appearance="appearance"
              :seriousness="seriousness"
              :size="_sizes[size]"
              :disabled="disabled"
            >
              text
            </ui-button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td>
            <code>
              <b>
                Options
              </b>
            </code>
          </td>
          <td :colspan="buttonSeriousness.length">
            <div class="d-flex g4">
              <div class="d-flex align-center g2">
                <code>disabled:</code>
                <ui-switch v-model="disabled" />
              </div>
              <div class="d-flex align-center g2">
                <code>size:</code>
                <ui-select
                  v-model="size"
                  :options="sizes"
                />
              </div>
            </div>
          </td>
        </tr>
      </tfoot>
    </ui-table-accordion>
    <ui-table-accordion>
      <template #caption>
        &lt;ui-async-button&gt;&lt;/ui-async-button&gt; {{ progress?.toFixed(2) }}
      </template>
      <thead>
        <tr>
          <ui-table-cell-diagonal
            column-text="appearance"
            row-text="seriousness"
          />
          <th
            v-for="seriousness of buttonSeriousness"
            :key="seriousness"
          >
            {{ seriousness }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="appearance of buttonAppearance"
          :key="appearance"
        >
          <td
            class="ui-table__col_primary"
          >
            {{ appearance || 'unset' }}
          </td>
          <td
            v-for="seriousness of buttonSeriousness"
            :key="seriousness"
          >
            <ui-async-button
              :appearance="appearance"
              :seriousness="seriousness"
              :size="_sizes[size]"
              :progress="progress"
              :disabled="disabled"
              @click="progress === undefined ? nextProgress() : undefined"
            >
              Async
            </ui-async-button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td>
            <code>
              <b>
                Options
              </b>
            </code>
          </td>
          <td :colspan="buttonSeriousness.length">
            <div class="d-flex g4">
              <div class="d-flex align-center g2">
                <code>disabled:</code>
                <ui-switch v-model="disabled" />
              </div>
              <div class="d-flex align-center g2">
                <code>size:</code>
                <ui-select
                  v-model="size"
                  :options="sizes"
                />
              </div>
            </div>
          </td>
        </tr>
      </tfoot>
    </ui-table-accordion>
    <ui-table-accordion>
      <template #caption>
        &lt;ui-icon-button&gt;&lt;/ui-icon-button&gt; {{ progress?.toFixed(2) }}
      </template>
      <thead>
        <tr>
          <ui-table-cell-diagonal
            column-text="appearance"
            row-text="seriousness"
          />
          <th
            v-for="seriousness of buttonSeriousness"
            :key="seriousness"
          >
            {{ seriousness }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="appearance of buttonAppearance"
          :key="appearance"
        >
          <td
            class="ui-table__col_primary"
          >
            {{ appearance || 'unset' }}
          </td>
          <td
            v-for="seriousness of buttonSeriousness"
            :key="seriousness"
          >
            <ui-icon-button
              :appearance="appearance"
              :seriousness="seriousness"
              :icon="icon === randomText ? random() : icon"
              :size="_sizes[size]"
              :disabled="disabled"
            >
              Async
            </ui-icon-button>
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td>
            <code>
              <b>
                Options
              </b>
            </code>
          </td>
          <td :colspan="buttonSeriousness.length">
            <div class="d-flex g4">
              <div class="d-flex align-center g2">
                <code>disabled:</code>
                <ui-switch v-model="disabled" />
              </div>
              <div class="d-flex align-center g2">
                <code>size:</code>
                <ui-select
                  v-model="size"
                  :options="sizes"
                />
              </div>
              <div class="d-flex align-center g2">
                <code>icon:</code>
                <ui-select
                  v-model="icon"
                  :options="icons"
                />
              </div>
            </div>
          </td>
        </tr>
      </tfoot>
    </ui-table-accordion>
  </ui-card>
</template>

<script
  setup
  lang="ts"
>
import defaultIcons from '@/assets/icon.svg?raw'
import UiTableAccordion from '@/components/ui/table/UiTableAccordion.vue'
import UiTableCellDiagonal from '@/components/ui/table/UiTableCellDiagonal.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiCard from '@/components/ui/UiCard.vue'
import UiIconButton from '@/components/ui/UiIconButton.vue'
import UiSelect from '@/components/ui/UiSelect.vue'
import UiSwitch from '@/components/ui/UiSwitch.vue'
import UiAsyncButton from '@/components/ui/UiAsyncButton.vue'
import { ref } from 'vue'

const buttonSeriousness = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'passive'] as const
const buttonAppearance = [undefined, 'text', 'outlined', 'rounded', 'rounded-outlined', 'rounded-text'] as const
const disabled = ref<boolean>(false)
const progress = ref<undefined | number>(undefined)
const size = ref<'small' | 'large' | 'default'>('default')
const sizes = ['small', 'large', 'default']
const _icons = defaultIcons.match(/id="([a-z]|-|[0-9])*"/gm)?.map(_ => _.slice(4, -1)) as Array<string>
const randomText = 'random()'
const icons = [randomText, ..._icons]
const icon = ref<(typeof icons)[number]>(icons[0])
function random (): string {
  return _icons[Math.floor(Math.random() * _icons.length)]
}
const _sizes = {
  small: 'small',
  large: 'large',
  default: undefined
} as const

function nextProgress (): void {
  if (progress.value === undefined) {
    progress.value = NaN
    return nextProgress()
  } else {
    setTimeout(() => {
      if (progress.value === undefined) {
        progress.value = NaN
        return nextProgress()
      }
      if (!isFinite(progress.value)) {
        progress.value = 0
        return nextProgress()
      }
      progress.value += Math.random() * 0.5
      if (progress.value > 1) {
        return setTimeout(() => progress.value = undefined, Math.random() * 500 + 250)
      }
      return nextProgress()
    }, Math.random() * 500 + 250)
  }
}
</script>

<style
  lang="scss"
  scoped
>

</style>