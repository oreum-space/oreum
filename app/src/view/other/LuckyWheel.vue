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
    </div>
    <ui-card class="other-lucky-wheel__actions ga">
      <ui-input-text
        v-model="name"
        label="Name"
      />
      <ui-input-text
        v-model="value"
        label="Value"
      />
      <div class="d-flex ga">
        <ui-input-color v-model="color" />
        <ui-button
          appearance="outlined"
          seriousness="success"
          @click="addItem"
        >
          Add
        </ui-button>
      </div>
      <ui-async-button
        seriousness="info"
        size="large"
        @click="wheel"
      >
        Wheel
      </ui-async-button>
    </ui-card>
  </main>
</template>

<script
  setup
  lang="ts"
>
import UiInputColor from '@/components/ui/input/color/UiInputColor.vue'
import UiInputText from '@/components/ui/input/UiInputText.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiCard from '@/components/ui/UiCard.vue'
import UiAsyncButton from '@/components/ui/UiAsyncButton.vue'
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

const totalValue = computed(() => items.value.reduce((a, _) => a + _.value, 0))
const angle = ref<number>(0)

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
    backgroundColor: isItemColor(item) ? item.color : 'gray',
    clipPath: getClipPath(item),
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
    background: red;
    rotate: var(--rotate);
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

  &__actions {
    flex-grow: 1;

    .ui-input-text {
      --width: 100%;
    }
  }
}

@media (max-aspect-ratio: 4 / 3) {
  .other-lucky-wheel {
    flex-flow: column;
    justify-content: space-between;

    &__wheel {
      margin: auto;
    }

    &__actions {
      width: 100%;
      flex-flow: row;
      order: -1;
      flex-grow: 0;

      .ui-input-text {
        flex-grow: 1;
      }

      .d-flex {
        flex-grow: 2;
        width: 100%;
      }
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