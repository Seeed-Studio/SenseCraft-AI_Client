<template lang="">
  <div class="right-sider" :class="{ collapsed: !systemStore.visibleRightSider }">
    <div
      aria-orientation="vertical"
      role="toolbar"
      class="rounded-component max-w-full overflow-hidden bg-white px-20 py-20 dark:bg-dark-component-bg h-full flex flex-col"
    >
      <button
        class="focus-control right-sider-btn grow min-w-max"
        @click="
          () => {
            router.replace({ name: ERouter.STREAM_LIST })
          }
        "
      >
        <div>
          <img :src="videoIcon" alt="" class="block w-30 mx-auto mb-23" />
          <div class="mt-8 font-bold text-16 font-mst-m">{{ $t('videoStream') }}</div>
        </div>
      </button>
      <button
        class="focus-control right-sider-btn w-full grow"
        @click="
          () => {
            router.replace({ name: ERouter.SETTING })
          }
        "
      >
        <div>
          <img :src="settingIcon" alt="" class="block w-30 mx-auto mb-23" />
          <div class="mt-8 font-bold text-16 font-mst-m">{{ $t('setting') }}</div>
        </div>
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useRouter, useRoute } from 'vue-router'
import videoIcon from '@renderer/assets/img/icons/icon_video_l.svg'
import settingIcon from '@renderer/assets/img/icons/icon_setting.svg'
import quitIcon from '@renderer/assets/img/icons/icon_out.svg'
import { useSystemStore } from '@renderer/store'
import { useQuitApp } from '@renderer/utils'
import { ERouter } from '@renderer/types/defines'

const systemStore = useSystemStore()
const router = useRouter()
</script>
<style lang="scss" scoped>
.right-sider {
  width: var(--right-sider-w);
  overflow: hidden;
  max-width: var(--right-sider-w);
  opacity: var(--right-sider-opacity);
  transition: ease-in 0.3s;
  transition-property: max-width opacity padding-left padding-right;
  box-sizing: border-box;
  &.collapsed {
    max-width: 0;
    opacity: 0;
    padding-left: 0;
    padding-right: 0;
    transition-duration: 0s;
  }
  .right-sider-btn {
    background-color: var(--bg-dark-component-bg);
    border: none;
    border-radius: 0;
    border-bottom: 1px solid var(--border-color);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    & + .right-sider-btn {
      margin-top: 20px;
    }
    &:last-child {
      border-bottom: none;
    }
  }
}
.right-sider-btn {
}
</style>
<style>
:deep .div__text {
  display: block;
}
</style>
