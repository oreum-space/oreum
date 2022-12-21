<template>
  <ui-card>
    <h1>
      Select
    </h1>
    <div class="d-flex g2">
      <ui-select
        v-model="value"
        :options="options"
        label="Select"
      />
      <ui-icon-button
        seriousness="secondary"
        appearance="text"
        icon="erase"
        size="large"
        @click="value = undefined"
      />
    </div>
    <div class="d-flex g2">
      <ui-select
        v-model="valueLong"
        :options="optionsLong"
        label="Select long"
      />
      <ui-icon-button
        seriousness="secondary"
        appearance="text"
        icon="erase"
        size="large"
        @click="valueLong = undefined"
      />
    </div>
    <div class="d-flex g2">
      <ui-select
        v-model="valueSmall"
        :options="optionsSmall"
        label="Select with small amount"
      />
      <ui-icon-button
        seriousness="secondary"
        appearance="text"
        icon="erase"
        size="large"
        @click="valueSmall = undefined"
      />
    </div>
    <div class="d-flex g2">
      <ui-select
        v-model="valueWithOption"
        :options="optionsWithOption"
        label="Select with default option"
      />
      <ui-icon-button
        seriousness="secondary"
        appearance="text"
        icon="erase"
        size="large"
        @click="valueWithOption = undefined"
      />
    </div>
    <ui-select
      label="Select empty"
    />
    <ui-select
      label="Select disabled"
      disabled
    />
    <div class="d-flex g2">
      <ui-tree-select
        v-model="treeSelectValue"
        label="Tree Select"
        items-key="children"
        :options="treeSelectOptions"
      />
      <ui-icon-button
        seriousness="danger"
        appearance="text"
        icon="erase"
        size="large"
        :disabled="!treeSelectValue"
        @click="treeSelectValue = undefined"
      />
    </div>
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
import UiInputText from '@/components/ui/input/UiInputText.vue'
import UiInputTextarea from '@/components/ui/input/UiInputTextarea.vue'
import UiTreeSelect from '@/components/ui/tree-select/UiTreeSelect.vue'
import UiCard from '@/components/ui/UiCard.vue'
import UiIcon from '@/components/ui/UiIcon.vue'
import UiIconButton from '@/components/ui/UiIconButton.vue'
import UiSelect from '@/components/ui/UiSelect.vue'
import { Ref, ref } from 'vue'

const options = new Array(32).fill(null).map((value, index) => `Option ${index}`)
const value = ref<string>()
const optionsLong = new Array(32).fill(null).map((value, index) => `[${index}] Option with long long long string`)
const valueLong = ref<string>()
const optionsSmall = new Array(2).fill(null).map((value, index) => `Option ${index}`)
const valueSmall = ref<string>()
const optionsWithOption = new Array(4).fill(null).map((value, index) => `Option ${index}`)
const valueWithOption = ref<string | undefined>(optionsWithOption[0])

const treeSelectOptions = [
  {
    type: 'branch',
    value: 'Documents',
    children: [
      {
        type: 'branch',
        value: 'Work',
        children: [
          'Expenses.doc',
          'Resume.doc'
        ]
      },
      {
        type: 'branch',
        value: 'Home',
        children: [
          'Invoices.doc'
        ]
      }
    ],
  },
  {
    type: 'branch',
    value: 'Events',
    children: [
      'Meeting',
      'Product Launch',
      'Report Review'
    ]
  },
  {
    type: 'branch',
    value: 'Movies',
    children: [
      {
        type: 'branch',
        value: 'Al Pacino',
        children: [
          'Scarface',
          'Serpico'
        ]
      },
      {
        type: 'branch',
        value: 'Robert De Niro',
        children: [
          'Goodfellas',
          'Untouchables'
        ]
      }
    ]
  }
]
const treeSelectValue = ref<Ref['value']>(undefined)
</script>
