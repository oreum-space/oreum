<template>
  <ui-card>
    <h1>
      User Interface
    </h1>
    <ui-input-textarea
      v-model="text"
      class="dimensional"
      label="Response body"
      code
    />
  </ui-card>
</template>

<script
  setup
  lang="ts"
>
import UiInputTextarea from '@/components/ui/input/UiInputTextarea.vue'
import UiCard from '@/components/ui/UiCard.vue'
import { ref } from 'vue'

const text = ref(`.dimensional {
  scale: 1.5;
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
}`)
</script>

<style lang="scss">
.dimensional {
  scale: 1;
  margin-block: 120px;
  max-width: 60%;
  left: 50%;
  translate: -50% 0 -120px;
  transform: rotate3d(0.5, 1, 0, 20deg) scale3d(1, 1, 1);
  transition: transform var(--transition-cubic-slow);
  transform-style: preserve-3d;
  perspective: 2400px;
  min-width: 240px;

  &::after,
  &::before {
    position: absolute;
    left: -25%;
    top: 0;
    content: ' ';
    width: 50%;
    height: 100%;
    transform: rotateY(90deg) translateZ(0px);
    --border-color: var(--surface-border-a);
    box-shadow: inset 0 0 2px 1px var(--border-color);
  }

  &:focus-within::after,
  &:focus-within::before {
    --border-color: var(--text-color-secondary);
  }

  &::after {
    width: 100%;
    padding-block: 25%;
    height: 0;
    left: -100%;
    top: 100%;
    transform: rotateX(-90deg) translateX(100%) translateZ(-60px);
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
    transform: rotate3d(0.5, 1, 0, 12.5deg) scale3d(1.1, 1.1, 1.1);
  }

  &:focus,
  &:focus-within {
    transform: rotate3d(0.5, 1, 0, 5deg) scale3d(1.2, 1.2, 1.2);
  }
}
</style>