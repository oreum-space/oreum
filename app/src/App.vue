<template>
  <template v-if="$route.name">
    <app-dialog />
    <transition name="app-header">
      <app-header
        ref="header"
        @mounted="addHeaderResizeListener"
      />
    </transition>
    <app-main />
    <app-footer
      ref="footer"
      @mounted="addFooterResizeListener"
    />
    <app-scroll />
  </template>
</template>

<script
  setup
  lang="ts"
>
import AppDialog from '@/components/app/AppDialog.vue'
import AppHeader from '@/components/app/AppHeader.vue'
import AppMain from '@/components/app/AppMain.vue'
import AppFooter from '@/components/app/AppFooter.vue'
import AppScroll from '@/components/app/AppScroll.vue'
import { provide, Ref, ref } from 'vue'

const header = ref<typeof AppHeader>() as Ref<typeof AppHeader>
const footer = ref<typeof AppScroll>() as Ref<typeof AppScroll>

const windowWidth = ref<number>(window.innerWidth)
const windowHeight = ref<number>(window.innerHeight)

provide('windowWidth', windowWidth)
provide('windowHeight', windowHeight)
addEventListener('scroll', calcViewHeight)
addEventListener('resize', calcViewHeight)

function calcViewHeight () {
  const headerHeight = header.value ? header.value.$el.clientHeight : 0
  const footerHeight = footer.value ? footer.value.$el.clientHeight : 0
  const footerOnScreenHeight =
    Math.max(0, (document.documentElement.scrollHeight -
      document.documentElement.clientHeight -
      document.documentElement.scrollTop - footerHeight) * -1)

  windowWidth.value = window.innerWidth
  windowHeight.value = window.innerHeight

  document.documentElement.style.setProperty('--header-height', `${ headerHeight }px`)
  document.documentElement.style.setProperty('--jsvh', `${ window.innerHeight / 100 }px`)
  document.documentElement.style.setProperty('--view', `calc(var(--fvh) - ${ headerHeight + footerOnScreenHeight }px)`)
}

const observer = new ResizeObserver(calcViewHeight)

function addHeaderResizeListener () {
  observer.observe(header.value.$el)
}

function addFooterResizeListener () {
  observer.observe(footer.value.$el)
}

observer.observe(document.documentElement)
</script>

<style lang="scss">
.app-header {
  transition: padding-block var(--transition-cubic-slow), height var(--transition-cubic-slow);
}

.app-header-enter-active,
.app-header-leave-active {
  height: var(--app-header-height) !important;
  overflow: hidden;
}

.app-header-enter-from,
.app-header-leave-to {
  height: 0 !important;
  padding-block: 0 !important;
  overflow: hidden;
}
</style>