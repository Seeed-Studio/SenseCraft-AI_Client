<template lang="">
  <div class="layout">
    <div
      ref="layoutHeader"
      class="layout-header fixed w-full top-0 left-0 bg-zinc-100 dark:bg-black"
    >
      <div
        class="flex items-center justify-between py-14 px-15 md:px-20 bg-white dark:bg-dark-component-bg"
      >
        <button class="text-active font-bold text-18 font-mst-b focus-control">
          {{ $t('title') }}
        </button>
        <div class="grow flex justify-end items-center">
          <Clock
            class="text-zinc-500 text-15 font-mst-b whitespace-nowrap min-w-180 w-max overflow-hidden text-right"
          ></Clock>
        </div>
      </div>
      <SubHeader v-if="!route.meta.hideSubHeader && systemStore.status === ELoadStatus.LOADED" />
    </div>
    <RightSider class="right-sider-section shrink-0 fixed py-20 pr-20 right-0 z-50" />
    <div class="layout-content box-border" :class="{ collapsed: systemStore.visibleRightSider }">
      <!-- <router-view  /> -->
      <!-- <RightSider/> -->
      <router-view v-slot="{ Component }" v-if="systemStore.status === ELoadStatus.LOADED">
        <!-- <keep-alive :include="['live']"> -->
        <component :is="Component" />
        <!-- </keep-alive> -->
      </router-view>
      <div v-else class="flex w-full h-full items-center justify-center">
        <div>
          <div
            v-if="systemStore.status === ELoadStatus.LOADING"
            class="text-center text-18 font-mst-m text-active"
          >
            <LoadingIcon size="50" />
            <div class="mt-20">{{ t('loadingConfig') }} ...</div>
          </div>
          <div v-else class="text-center text-18 font-mst-m">
            <div class="text-red-600"><ErrorCircleIcon size="50" /></div>
            <div class="mt-20 text-red-600">{{ t('failedConfig') }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, watch, nextTick, onMounted, watchEffect } from 'vue'
import { useSystemStore } from '@renderer/store'
import { useRoute } from 'vue-router'
import { LoadingIcon, ErrorCircleIcon, PoweroffIcon, RefreshIcon } from 'tdesign-icons-vue-next'
import { ELoadStatus } from '@renderer/types/defines'
import { useQuitApp, useReloadApp } from '@renderer/utils'
import i18n from '@renderer/i18n'
const { t } = i18n.global
const systemStore = useSystemStore()
const route = useRoute()
const layoutHeader = ref()

// Set Theme
systemStore.setThemeMode()

const handleUpdateContentHeight = () => {
  let h = layoutHeader.value.clientHeight
  document.documentElement.style.setProperty('--layout-header-h', h + 'px')
}

watchEffect(() => {
  systemStore.visibleRightSider = Boolean(
    route.meta.visibleRightSider && systemStore.status === ELoadStatus.LOADED
  )
  if (systemStore.status === ELoadStatus.LOADED) {
    nextTick(() => {
      handleUpdateContentHeight()
    })
  }
})
</script>
<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100vh;
  padding-top: var(--layout-header-h);
}
.layout-header {
  // height: var(--layout-header-h);
  box-sizing: border-box;
  z-index: 100;
}
.layout-content {
  box-sizing: border-box;
  // padding: 20px 20px;
  height: var(--layout-content-h);
  max-width: 100%;
  transition: linear 0.3s max-width;
  // overflow: hidden;
  &.collapsed {
    max-width: calc(100% - var(--right-sider-w));
  }
}
.right-sider-section {
  height: var(--right-sider-h);
  top: var(--layout-header-h);
}
</style>
<style>
.focused {
  outline: 2px solid var(--primary-color);
  box-shadow: 0 0 10px var(--primary-color);
  border-radius: 5px !important;
}
</style>
