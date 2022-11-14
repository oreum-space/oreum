<template>
  <label
    class="ui-input-wrapper ui-input-text"
    :style="{ '--counter-width': code ? `${counters}`.length * 9.6 + 'px' : undefined }"
  >
    <textarea
      ref="textarea"
      v-model="value"
      class="ui-input ui-input-textarea"
      placeholder=" "
      :class="{
        'ui-input_invalid': invalid,
        'ui-input-textarea_code': code
      }"
      :disabled="_disabled"
    />
    <label
      v-if="label"
      class="ui-input-label"
    >
      {{ label }}
    </label>
    <span
      ref="countersElement"
      v-if="counters"
      class="ui-input-textarea__counters"
    >
      <span
        v-for="c in counters"
        :key="c"
        class="ui-input-textarea__counter"
      >
        {{ c }}
      </span>
    </span>
  </label>
</template>

<script
  setup
  lang="ts"
>
import { computed, onBeforeUnmount, onMounted, Ref, ref } from 'vue'

type Props = {
  label?: string,
  modelValue?: string,
  invalid?: boolean,
  disabled?: boolean,
  code?: boolean
}

type Emits = {
  (e: 'update:modelValue', value: string): void
}

const props = defineProps<Props>()
const emits = defineEmits<Emits>()

const textarea = ref<HTMLTextAreaElement>() as Ref<HTMLTextAreaElement>
const countersElement = props.code ? ref<HTMLElement>() : undefined

const
  value = computed({
    get (): string {
      return props.modelValue || ''
    },
    set (value: string) {
      emits('update:modelValue', value)
    }
  }),
  _disabled = computed(() => typeof props.modelValue !== 'string' || !!props.disabled),
  counters = computed(() => props.code ? 1 + (value.value.match(/\n/g)||[]).length : 0)

function onscroll () {
  if (countersElement?.value) {
    countersElement.value.scrollTop = textarea.value.scrollTop
  }
}

if (props.code) {
  onMounted(() => {
    textarea.value.addEventListener('scroll', onscroll)
  })
  onBeforeUnmount(() => {
    textarea.value.removeEventListener('scroll', onscroll)
  })
}

</script>

<style
  lang="scss"
  scoped
>

</style>