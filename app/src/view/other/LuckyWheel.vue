<template>
  <main class="app-main other-lucky-wheel">
    <div class="other-lucky-wheel__wheel">
      <div class="other-lucky-wheel__arrow" />
      <div
        class="other-lucky-wheel__content"
        :style="{ rotate: `${angle}rad` }"
      >
        <div class="other-lucky-wheel__shadow" />
        <template v-if="items.length">
          <div
            v-for="item of items"
            :key="item.name"
            :style="getItemStyle(item)"
            class="other-lucky-wheel__item"
            @click="removeItem(item)"
          >
            <h3 class="other-lucky-wheel__item-name">
              {{ item.name }}
            </h3>
          </div>
        </template>
        <div
          v-else
          class="other-lucky-wheel__empty"
        >
          <h2>
            Empty
          </h2>
        </div>
      </div>
      <ui-button
        class="other-lucky-wheel__add"
        size="large"
        seriousness="success"
        appearance="outlined"
        @click="dialog.show('lucky-wheel')"
      >
        <ui-icon
          icon="plus"
        />
        Add
      </ui-button>
      <ui-button
        class="other-lucky-wheel__start"
        size="large"
        seriousness="primary"
        appearance="outlined"
        @click="wheel"
      >
        <ui-icon
          icon="dot"
        />
        Wheel
      </ui-button>
    </div>
    <ui-dialog
      classes="other-lucky-wheel__dialog"
      name="lucky-wheel"
      title="New element"
      disable-footer
    >
      <template #body>
        <ui-tree-select
          v-model="element"
          label="Element"
          :options="elements"
        >
          <template #selected="{ selected }">
            <div
              :style="{
                width: '16px',
                height: '16px',
                borderRadius: '4px',
                backgroundColor: selected?.value.color || '#888888',
                border: '1px solid var(--surface-border-a)'
              }"
            />
            <span>
              {{ selected?.value.name || '-' }}
            </span>
            <small>
              <code>
                {{ selected?.value.value || '-' }}
              </code>
            </small>
          </template>
          <template #item="{ item }">
            <div
              :style="{
                width: '16px',
                height: '16px',
                borderRadius: '4px',
                backgroundColor: item.value.color,
                border: '1px solid var(--surface-border-a)'
              }"
            />
            <span>
              {{ item.value.name }}
            </span>
            <small>
              <code>
                {{ item.value.value }}
              </code>
            </small>
          </template>
        </ui-tree-select>
        <div class="other-lucky-wheel__general">
          <ui-input-text
            v-model="name"
            label="Name"
          />
          <ui-input-text
            v-model="value"
            label="Value"
          />
        </div>
        <div class="other-lucky-wheel__background">
          <ui-select
            v-model="background"
            label="Background"
            :options="backgrounds"
          />
          <ui-input-color
            v-if="background === backgrounds[1]"
            v-model="color"
          />
          <ui-input-text
            v-else
            v-model="image"
            label="Image URL"
          />
        </div>
        <div class="d-flex f-row g2 justify-between">
          <ui-button
            size="small"
            seriousness="success"
            appearance="text"
          >
            <ui-icon
              icon="plus"
            />
            Save
          </ui-button>
          <ui-button
            size="small"
            seriousness="success"
            appearance="default"
            @click="addItem"
          >
            <ui-icon
              icon="plus"
            />
            Add
          </ui-button>
        </div>
      </template>
    </ui-dialog>
  </main>
</template>

<script
  setup
  lang="ts"
>
import UiInputColor from '@/components/ui/input/color/UiInputColor.vue'
import UiInputText from '@/components/ui/input/UiInputText.vue'
import UiTreeSelect from '@/components/ui/tree-select/UiTreeSelect.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiDialog from '@/components/ui/UiDialog.vue'
import UiIcon from '@/components/ui/UiIcon.vue'
import UiSelect from '@/components/ui/UiSelect.vue'
import useDialog from '@/store/dialog'
import { computed, ref } from 'vue'

interface ItemBase {
  name: string,
  value: number
}

interface ItemImage extends ItemBase {
  image: string
}

interface ItemColor extends ItemBase {
  color: string
}

type Item = ItemImage | ItemColor

const defaultItems = [
  {
    value: {
      name: 'Item 1 Lorem ipsum dolor sit amet.',
      value: 6,
      color: 'darkred'
    }
  }, {
    value: {
      name: 'Item 2 Lorem ipsum dolor sit amet.',
      value: 3,
      color: 'darkblue'
    }
  }, {
    value: {
      name: 'Item 3 Lorem ipsum dolor sit amet.',
      value: 1,
      color: 'darkgreen'
    }
  }
]

const custom = {
  value: {
    name: 'Custom',
    value: 1,
    color: '#888888'
  }
}

const elements = computed(() => {
  return [
    custom,
    ...defaultItems
  ]
})

const backgrounds = ['Image', 'Color']

const background = ref<string>(backgrounds[1])

const element = ref<unknown>(custom.value)

const items = ref<Array<Item>>([
  {
    name: 'Item 1 Lorem ipsum dolor sit amet.',
    value: 6,
    color: 'darkred'
  }, {
    name: 'Item 2 Lorem ipsum dolor sit amet.',
    value: 3,
    color: 'darkblue'
  }, {
    name: 'Item 3 Lorem ipsum dolor sit amet.',
    value: 1,
    color: 'darkgreen'
  }
])
const name = ref<string>('')
const value = ref<string>('1')
const color = ref<string>('#888888')
const image = ref<string>('')

const totalValue = computed(() => items.value.reduce((a, _) => a + _.value, 0))
const angle = ref<number>(0)
const dialog = useDialog()

function isItemColor (item: Item): item is ItemColor {
  return 'color' in item
}

function getClipPosition (percent: number): string {
  return `${200 * Math.cos(percent * Math.PI * 2) + 50}% ${200 * Math.sin(percent * Math.PI * 2) + 50}%`
}

function getClipPath (item: Item): string {
  const percent = item.value / totalValue.value
  const position = getClipPosition(percent)

  if (percent < 0.125) {
    return `polygon(50% 50%, 100% 50%, ${position})`
  }
  if (percent < 0.25) {
    return `polygon(50% 50%, 100% 50%, 100% 100%, ${position})`
  }
  if (percent < 0.375) {
    return `polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%, ${position})`
  }
  if (percent < 0.5) {
    return `polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%, 0 100%, ${position})`
  }
  if (percent < 0.625) {
    return `polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%, 0 100%, 0 50%, ${position})`
  }
  if (percent < 0.75) {
    return `polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%, 0 100%, 0 50%, 0 0, ${position})`
  }
  if (percent < 0.875) {
    return `polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%, 0 100%, 0 50%, 0 0, 50% 0, ${position})`
  }
  return `polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%, 0 100%, 0 50%, 0 0, 50% 0, 100% 0, ${position})`
}

function getRotate (item: Item): string {
  const percent = items.value.slice(0, items.value.indexOf(item)).reduce((a, _) => a + _.value, 0) / totalValue.value

  return `${Math.PI * 2 * percent}rad`
}

function getHalf (item: Item): string {
  const percent = item.value / totalValue.value

  return `${Math.PI * 2 * percent / 2}rad`
}

function getItemStyle (item: Item): Record<string, string> {
  return {
    '--background-color': isItemColor(item) ? item.color : 'gray',
    '--clip-path': getClipPath(item),
    '--rotate': getRotate(item),
    '--half': getHalf(item)
  }
}

function wheel () {
  angle.value += Math.random() * Math.PI * 10 + Math.PI * 5 + Math.random() * Math.PI
}

function removeItem (item: Item): void {
  items.value = items.value.filter(_ => _ !== item)
}

function addItem (): void {
  const _value = +value.value

  items.value.push({
    name: name.value,
    value: isNaN(_value) && _value <= 0 ? 1 : _value,
    color: color.value
  })
}

</script>

<style lang="scss">
.other-lucky-wheel {
  display: flex;
  flex-flow: row;
  gap: var(--app-padding);
  align-items: center;
  justify-content: center;
  max-height: calc(var(--fvh) - var(--header-height));
  overflow: hidden;

  &__empty {
    position: absolute;
    top: 25%;
    left: 50%;
    translate: -50% -50%;
  }

  &__wheel {
    position: relative;
    width: min(calc(var(--fvh) - var(--header-height) - var(--app-padding) * 3),
    calc(100vw - var(--app-padding) * 2));
    min-height: min(min(
      calc(var(--fvh) - var(--header-height) - var(--app-padding) * 3),
      calc(100vw - var(--app-padding) * 2)), 1000px);
    max-height: 1000px;
    max-width: 1000px;
    border-radius: 50%;
    background-color: var(--surface-a);
    border: 4px solid var(--surface-border);
    box-shadow: 0 0 16px black;

    &::before {
      content: ' ';
      position: absolute;
      left: 50%;
      top: 50%;
      width: 10%;
      height: 10%;
      border-radius: 50%;
      translate: -50% -50%;
      background-color: var(--surface-b);
      border: 4px solid var(--surface-border);
      box-shadow: 0 0 16px black, inset 0 0 16px black;
      z-index: 2;
    }
  }

  &__shadow {
    position: absolute;
    z-index: 1;
    width: 100%;
    height: 100%;
    top: 0;
    border-radius: 50%;
    box-shadow: inset 0 0 16px black;
    pointer-events: none;
  }


  &__content {
    display: flex;
    width: 100%;
    height: 100%;
    position: relative;
    padding: 50% 0;
    overflow: hidden;
    border-radius: 50%;
    transition: rotate ease-out 3s;
  }

  &__item {
    position: absolute;
    top: 0;
    left: 50%;
    translate: -50% 0;
    transform-origin: 50% 50%;
    height: 100%;
    width: 100%;
    rotate: var(--rotate);
    border-radius: 50%;
    background-color: var(--background-color);
    clip-path: var(--clip-path);
  }

  &__item-name {
    position: relative;
    display: block;
    left: 55%;
    text-align: center;
    top: 50%;
    width: 45%;
    max-width: 45%;
    translate: 0 -50%;
    transform-origin: -10% 50%;
    rotate: var(--half);
    padding-inline: 10% 2.5%;
  }

  &__arrow {
    position: absolute;
    left: 50%;
    top: -5%;
    width: 5%;
    height: 10%;
    translate: -50% 0;
    background-color: var(--text-color);
    clip-path: polygon(50% 0, 0 25%, 50% 100%, 100% 25%);
    transform-origin: 50% 550%;
    rotate: 45deg;
    z-index: 2;

    &::before {
      position: absolute;
      content: ' ';
      width: 100%;
      height: 100%;
      background-color: var(--info-color);
      clip-path: polygon(50% 4px, 4px 25%, 50% calc(100% - 8px), calc(100% - 4px) 25%);
    }
  }

  &__start {
    position: absolute;
    left: 0;
    bottom: 0;
  }

  &__add {
    position: absolute;
    right: 0;
    bottom: 0;
  }

  &__dialog .ui-dialog__body {
    & > .ui-input-text,
    & > .ui-select {
      --width: min(calc(100vw - 64px), 480px);
    }
  }

  &__dialog {
    .ui-tree-select-item__content {
      max-width: 100%;
      width: 100%;
      span {
        display: flex;
        flex: 1 1;
      }

      code {
        flex-shrink: 0;
      }
    }
  }

  &__general {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    gap: 12px;
    max-width: calc(100vw - 64px);

    & .ui-input-text:first-child {
      --width: 100%;
    }

    & .ui-input-text:last-child {
      --width: 128px;
    }
  }

  &__background {
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    --width: 128px;
    gap: 12px;
    max-width: calc(100vw - 64px);

    .ui-input-text {
      --width: 100%;
    }

    .ui-input-color,
    .ui-input-color__button {
      max-width: 100%;
      width: 100%;
    }
  }
}

@media (max-aspect-ratio: 8 / 10) {
  .other-lucky-wheel {
    &__start,
    &__add {
      translate: 0 calc(100% + 8px);
    }
  }
}


@media (max-width: 768px) {
  .other-lucky-wheel {
    &__arrow::before {
      clip-path: polygon(50% 3px, 3px 25%, 50% calc(100% - 6px), calc(100% - 3px) 25%);
    }
  }
}
</style>