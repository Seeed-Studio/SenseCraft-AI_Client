<template lang="">
  <div
    :class="[{ 'visible-bottom': visibleBottomModels }]"
    class="w-full box-border content"
  >
    <div
      class="video-container pt-20"
    >
      <div class="video-section box-border max-w-full"  v-if="streams.length > 0">
        <div class="px-20 pb-20 flex flex-wrap justify-between content-start">
          <template v-for="(stream, idx) of streams">
            <button
              class="video-item relative bg-zinc-200 dark:bg-dark-component-bg rounded-component"
              :class="[{ single: streams.length === 1 }]"
              @click="
                () => {
                  systemStore.toggleRightSider()
                }
              "
            >
              <div class="absolute top-0 left-0 w-full h-full">
                <FramePlayer
                  :src="stream.playUrl"
                  :id="stream.index"
                  :fullscreen="false"
                />
              </div>
            </button>
          </template>
        </div>
      </div>
    </div>

    <!-- <RightSider class="right-sider-section shrink-0 fixed right-0 p-20 pl-0" /> -->
    <div class="video-frame-bottom" v-if="visibleBottomModels">
      <ModelList :stream-index="streams[0].index" display="swiper" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, watch, onMounted } from "vue"
import { useStreamStore } from "@renderer/store"
import { useSystemStore } from "@renderer/store"
import { useModelStore } from "@renderer/store"

const streamStore = useStreamStore()
const systemStore = useSystemStore()
const modelStore = useModelStore()
const streams = computed(() => {
  return streamStore.streams.filter((item, idx) => {
    item.index = idx; 
    return item.customer_enabled && item.playUrl
  }) 
})
const visibleBottomModels = computed(() => {
  return streams.value.length === 1 && modelStore.models.length > 0
})

watch(
  visibleBottomModels,
  (val) => {
    document.documentElement.style.setProperty(
      "--video-bottom-sider-h",
      val ? "170px" : "0px"
    )
  },
  {
    immediate: true
  }
)


</script>

<style lang="scss" scoped>
.content {
  position: relative;
  min-height: 100%;
  padding: 0 0 var(--video-bottom-sider-h) 0;
  box-sizing: border-box;
}
.video-container {
  position: relative;
  box-sizing: border-box;
  max-width: 100%;
}
.right-sider-section {
  height: var(--right-sider-h);
  top: var(--layout-header-h);
}

.video-frame-bottom {
  height: var(--video-bottom-sider-h);
  width: 100%;
  position: fixed;
  z-index: 10;
  left: 0;
  bottom: 0;
  box-sizing: border-box;
  padding: 0 20px 20px 20px;
}
.video-item {
  // height: auto;
  width: 100%;
  height: calc(var(--layout-content-h) - var(--video-bottom-sider-h) - 40px);
  &:not(.single) {
    max-width: calc(50% - 10px);
    height: 0;
    padding-bottom: 28%;
    position: relative;
    margin-bottom: 20px;
    flex-basis: calc(50% - 10px);
    overflow: hidden;
    cursor: pointer;
    .video-component {
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  &:nth-child(2n) {
    margin-left: 20px;
  }
}
</style>
