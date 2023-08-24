<template lang="">
  <template v-if="models && models.length > 0">
    <template v-if="props.display === 'list'">
      <div>
        <div class="mt-25" v-for="(item, idx) in models">
          <button
            class="w-full model-item text-dark-text-color focus-control"
            :class="{
              active: activeIndex === idx,
              'text-black dark:text-white': activeIndex === idx
            }"
            @click="handleSelectModel(item)"
          >
            <div class="flex items-center">
              <div class="w-90 shrink-0 mr-10">
                <div
                  class="w-full aspect-square model-icon border-2 border-dark-text-color rounded-full overflow-hidden p-1"
                >
                  <img
                    :src="item.icon"
                    class="w-full h-full object-cover rounded-full"
                    alt=""
                  />
                </div>
              </div>
              <div class="grow text-left leading-5">
                <div class="font-mst-b text-18 line-clamp-1 model-title">
                  {{ item.name }}
                </div>
                <div class="text-14 line-clamp-3 mt-10 model-desc">
                  {{ item.description }}
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </template>
    <template v-else>
      <div
        class="w-full relative p-20 px-40 h-full bg-zinc-100 dark:bg-dark-component-bg rounded-component"
      >
        <button
          class="focus-control absolute z-10 top-0 left-0 h-full slide-pre-btn"
        >
          <ChevronLeftIcon size="40" />
        </button>
        <button
          class="focus-control absolute z-10 top-0 right-0 h-full slide-next-btn"
        >
          <ChevronRightIcon size="40" />
        </button>
        <div class="swiper p-10">
          <div class="swiper-wrapper">
            <!-- Slides -->
            <div class="swiper-slide" v-for="(item, idx) in models">
              <button
                class="focus-control w-full model-item text-dark-text-color"
                :class="{
                  active: activeIndex === idx,
                  'text-black dark:text-white': activeIndex === idx
                }"
                @click="handleSelectModel(item)"
              >
                <div class="flex">
                  <div class="w-90 shrink-0 mr-10 self-center">
                    <div
                      class="w-full aspect-square model-icon border-2 border-zinc-500 rounded-full overflow-hidden p-1"
                    >
                      <img
                        :src="item.icon"
                        class="w-full h-full object-cover rounded-full overflow-hidden"
                        alt=""
                      />
                    </div>
                  </div>
                  <div class="grow text-left leading-5">
                    <div class="font-mst-b text-18 line-clamp-1 model-title">
                      {{ item.name }}
                    </div>
                    <div class="text-14 line-clamp-3 mt-10 model-desc">
                      {{ item.description }}
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </template>
</template>
<script lang="ts" setup>
import { Navigation, A11y } from "swiper/modules"
import { ChevronLeftIcon, ChevronRightIcon } from "tdesign-icons-vue-next"
import Swiper from "swiper"
import "swiper/css"
import { useStreamStore, useModelStore } from "@renderer/store"
import { ref, onMounted, computed, watch, nextTick } from "vue"
import { useRoute } from "vue-router"
import { IStream } from "@renderer/types/stream"
import {setStreamsConfig} from '@renderer/api'
import {
  EStreamOpera
} from "@renderer/types/defines"
// import { Swiper, useSwiper, SwiperSlide } from 'swiper/vue'

interface Props {
  streamIndex: number
  display: "list" | "swiper"
}
const route = useRoute()

const props = withDefaults(defineProps<Props>(), { display: "list" })
const streamStore = useStreamStore()
const modelStore = useModelStore()

const models = computed(() => modelStore.models)
const stream = computed(() =>  streamStore.streams[props.streamIndex])
const activeIndex = computed(() => modelStore.models.findIndex((item) => item.arguments.uuid === stream.value.modelId))
// initial swiper 
const initSwiper = () => {
  let sw = new Swiper(".swiper", {
    init: false,
    a11y: {},
    slidesPerView: 1,
    spaceBetween: 10,
    navigation: {
      nextEl: ".slide-next-btn",
      prevEl: ".slide-pre-btn"
    },
    keyboard: {
      enabled: true
    },
    modules: [Navigation, A11y],
    loop: false,
    breakpoints: {
      // when window width is >= 320px
      800: {
        slidesPerView: 2,
        spaceBetween: 20
      },
      1080: {
        slidesPerView: 3,
        spaceBetween: 20
      },
      // when window width is >= 320px
      1440: {
        slidesPerView: 4,
        spaceBetween: 20
      }
    }
  })

  sw.on("afterInit", () => {
    activeIndex.value >= 0 && sw.slideTo(activeIndex.value)
  })
  sw.on("resize", () => {
    activeIndex.value >= 0 && sw.slideTo(activeIndex.value)
  })
  // sw.init()
  return sw
}
const sw = initSwiper()
const handleSelectModel = (model) => {
  setStreamsConfig(EStreamOpera.MODIFY, {...stream.value, modelId: model.arguments.uuid}, props.streamIndex)
}

watch(
  () => useModelStore().models.length,
  () => {
    nextTick(() => {
      props.display === "swiper" && sw.init()
    })
  },
  { immediate: true }
)
</script>
<style lang="scss" scoped>
.model-item.active {
  color: var(--primary-color);
  .model-icon {
    box-sizing: border-box;
    border: 2px solid var(--primary-color);
  }
}
.model-title {
  word-break: break-all;
}
.model-desc {
  word-break: break-word;
}
.swiper-button-disabled {
  opacity: 0;
}
</style>
