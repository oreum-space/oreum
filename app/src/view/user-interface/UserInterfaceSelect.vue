<template>
  <ui-card>
    <ui-input-text />
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
    <ui-input-textarea
      v-model="text"
      class="dimensional"
      label="Response body"
      code
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
    <div>
      <ui-icon icon="folder" />
      <ui-icon icon="folder-empty" />
      <ui-icon icon="folder-transparent" />
    </div>
    <div style="color: var(--primary-color)">
      <ui-icon icon="folder" />
      <ui-icon icon="folder-empty" />
      <ui-icon icon="folder-transparent" />
    </div>
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
const text = ref<string>(`.dimensional {
  scale: 2;
  margin-block: 120px;
  max-width: 50%;
  left: 50%;
  translate: -50%;
  rotate: 1 1 0.1 15deg;
  transition: rotate var(--transition-cubic-slow);

  &:hover {
    rotate: 1 1 0 10deg;
  }

  &:focus,
  &:focus-within {
    rotate: 1 1 0 30deg;
  }
}`)
</script>

<style lang="scss">
.dimensional {
  scale: 1.75;
  margin-block: 120px;
  max-width: 60%;
  left: 50%;
  translate: -50% 0 -100px;
  transform: rotate3d(0.5, 1, 0, 20deg) scale3d(0.66, 0.66, 0.66);
  transition: transform var(--transition-cubic-slow);
  transform-style: preserve-3d;
  perspective: 2400px;

  &::after,
  &::before {
    position: absolute;
    left: -100%;
    top: 0;
    content: ' ';
    width: 50%;
    height: 100%;
    transform: rotateY(-90deg) translateZ(-180px);
    --border-color: var(--surface-border-a);
    // border: 2px solid var(--border-color);
    box-shadow: inset 0 0 2px 1px var(--border-color);
  }

  &:focus-within::after,
  &:focus-within::before {
    --border-color: var(--text-color-secondary);
  }

  &::after {
    width: 100%;
    height: 120px;
    top: 100%;
    transform: rotateX(-90deg) translateX(240px) translateZ(-60px);
  }

  .ui-input-textarea__counters {
    transform: translateZ(61px);
    transform-style: preserve-3d;
  }

  .ui-input-textarea__counter {

    transform-style: preserve-3d;
    transform: translateZ(120px);
  }

  .ui-input-label {
    transform: translateZ(75px);
  }

  textarea {
    transform: translateZ(60px);
    background: transparent;
  }

  &:hover {
    transform: rotate3d(0.5, 1, 0, 12.5deg) scale3d(0.88, 0.88, 0.88);
  }

  &:focus,
  &:focus-within {
    transform: rotate3d(0.5, 1, 0, 5deg);
  }
}
</style>
