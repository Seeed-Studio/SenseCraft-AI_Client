<template lang="">
  <div v-if="currentStream" class="video-fullscreen-frame relative h-full overflow-hidden">
    <SubHeader class="subheader absolute top-0 left-0 w-full z-20">
      <template #[header_title]>
        <div>
          {{ currentStream.name }}
        </div>
      </template>
    </SubHeader>
    <FramePlayer
      :src="currentStream.playUrl"
      :id="route.params?.id"
      :fullscreen="true"
    />
    <div
      class="video-setting-pop absolute z-10 bottom-0 left-0 flex items-end"
      :class="{ full: visibleModelList }"
      @click="
        () => {
          toggleVisibleModels(false)
        }
      "
    >
      <div
        ref="modelList"
        class="model-pop  max-h-full overflow-auto px-20 rounded-component"
        :class="{ collapsed: !visibleModelList }"
      >
      <div class="model-list">
        <ModelList
          display="list"
          :stream-index="parseInt(route.params?.id)"
        />
      </div>
       
        <div class="flex items-center">
          <button
            class="focus-control model-list-button p-20 flex items-center"
            @click.stop.capture="() => toggleVisibleModels()"
          >
            <img :src="ModelIcon" alt="" class="w-24 h-24 object-contain mr-10" />
            AI Model
          </button>
        </div>
      </div>

      <div class="opacity-70 ml-20">
        <button
          class="focus-control video-setting-btn p-20 flex items-center bg-black rounded-component"
          :class="{ 'hide-setting': visibleModelList }"
          @click="toStreamConfig"
        >
          <img :src="VideoIcon" alt="" class="w-24 h-24 object-contain mr-10" />
          Video Stream
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import {frameSrc} from '@renderer/api/api'
import { useModelStore, useStreamStore } from '@renderer/store'
import { EVideoTypes, ELayout, ERouter } from '@renderer/types/defines'
import { reactive, ref, computed, onMounted, nextTick } from 'vue'
import ModelIcon from '@renderer/assets/img/icons/icon_aimodel.svg'
import VideoIcon from '@renderer/assets/img/icons/icon_video_l.svg'

const header_title = ELayout.SUB_HEADER_CENTER
const modelStore = useModelStore()
const streamStore = useStreamStore()
const route = useRoute()
const router = useRouter()
const modelList = ref()

const currentStream = computed(() => {
  return streamStore.streams.find((item, idx) => idx + '' === route.params?.id)
})

const visibleModelList = ref(false)
const toggleVisibleModels = (value?: boolean) => {
  if (value !== void 0) {
    visibleModelList.value = value
    return
  }
  visibleModelList.value = !visibleModelList.value
  // scroll into view
  if (visibleModelList.value) {
    nextTick(() => {
      let $list = modelList.value.querySelector('.model-list')
      let $active = modelList.value.querySelector('.active')
      if (!($list && $active)) return
      $list.scrollTop = $active.offsetTop - 20
    })
  }
}
const toStreamConfig = () => {
  router.replace({
    name: ERouter.STREAM_CONFIG,
    params: { id: route.params?.id },
    query: { reference: route.name as string }
  })
}
</script>
<style lang="scss" scoped>
.subheader {
  background-color: rgba(0, 0, 0, 0.7);
}
.video-setting-pop {
  box-sizing: border-box;
  padding: 0 0 5% 5%;
  box-sizing: border-box;
  width: auto;
  height: auto;
  &.full {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
}
.model-pop {
  box-shadow: 0 1px 10px var(--primary-color);
  background-color: rgba(0,0,0,.7);
  backdrop-filter: blur(5px);
  .model-list {
    max-height: 500px;
    max-width: 500px;
    overflow: auto;
    opacity: 1;
    transition: ease-in 0.3s;
    transition-property: max-width max-height opacity;
  }
  &.collapsed {
    box-shadow: none;
    .model-list {
      max-width: 0;
      max-height: 0;
      opacity: 0;
      overflow: hidden;
    }
  }
}
.video-setting-btn {
  opacity: 1;
  transition: ease 0.2s;
  transform: scale(1);
  transform-origin: left bottom;
  transition-property: opacity transform;
  transition-delay: 0.3s;
  &.hide-setting {
    opacity: 0;
    max-width: 0;
    max-height: 0;
    overflow: hidden;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    transform: scale(0);
    transition-delay: 0s;
    transition-duration: 0s;
  }
}
</style>
