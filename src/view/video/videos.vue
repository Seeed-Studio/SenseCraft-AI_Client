<template lang="">
  <div class="h-full overflow-auto">
    <div class="stream-list flex flex-wrap m-auto p-20" role="toolbar">
      <button
        v-for="(stream, idx) of streamStore.streams"
        @click="toVideoConfig(idx)"
        class="focus-control stream-button border-box border border-transparent bg-white dark:bg-dark-component-bg font-mst-b rounded-component"
        :class="[{ living: stream.customer_enabled }]"
      >
        <div class="p-30 relative">
          <span
            v-show="stream.customer_enabled"
            class="w-3 h-3 rounded-full bg-active top-2 right-2 absolute"
          ></span>
          <div class="relative">
            <div class="px-8 text-center line-clamp-1">{{ stream.name }}</div>
          </div>
        </div>
      </button>
      <button
        @click="toVideoConfig('new')"
        class="focus-control stream-button border-box border-transparent border-2 text-active bg-white dark:bg-dark-component-bg font-mst-b rounded-component hover:border-active"
      >
        <div class="p-20 relative"><AddIcon size="50" /></div>
      </button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import { useStreamStore } from "@renderer/store"
import { ERouter, ELayout } from "@renderer/types/defines"
import { AddCircleIcon, AddIcon } from "tdesign-icons-vue-next"
const router = useRouter()
const streamStore = useStreamStore()

const toVideoConfig = (id: string) => {
  router.push({
    name: ERouter.STREAM_CONFIG,
    params: { id }
    // query: { id: 1 }
  })
}

const handleCreateStream = () => {}

</script>
<style lang="scss" scoped>
$btnW: 290;
$w: 290 * 4 + 20 * 4;
.stream-list {
  max-width: #{$w}px;
}
.stream-button {
  width: 100%;
  max-width: calc(25% - 20px);
  min-width: 200px;
  margin: 20px 10px 0 10px;
  font-size: 24px;
  cursor: pointer;
  &.living {
    // border-color: var(--primary-color);
  }
  @media screen and (max-width: 1220px) {
    max-width: calc(33.3% - 20px);
    font-size: 20px;
  }
  @media screen and (max-width: 1100px) {
    max-width: calc(33.3% - 20px);
  }
  @media screen and (max-width: 920px) {
    font-size: 18px;
  }
  @media screen and (max-width: 768px) {
    max-width: calc(50% - 20px);
    font-size: 20px;
  }

  @media screen and (max-width: 600px) {
    max-width: calc(50% - 20px);
    font-size: 16px;
  }

  @media screen and (max-width: 475px) {
    max-width: 100%;
    font-size: 16px;
  }
}
</style>
