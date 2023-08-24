<template lang="">
  <div class="focus-control w-full h-full relative rounded-component overflow-hidden">
    <!-- Loading -->
    <div
      class="absolute top-0 left-0 z-10 w-full h-full flex items-center justify-center"
      v-show="status === ELoadStatus.LOADING"
    >
      <div>
        <div class="text-40 text-active"><LoadingIcon /></div>
        <div v-if="reconnectTimes > 0" class="text-active text-center text-13 mt-5">
          {{ $t('reconnectNTimes', { t: reconnectTimes }) }}
        </div>
      </div>
    </div>
    <!-- Fail -->
    <div
      class="absolute top-0 left-0 z-10 w-full h-full flex items-center justify-center"
      v-show="status === ELoadStatus.FAILED"
    >
      <div class="w-3/5 max-w-full">
        <div
          v-show="statusTip"
          class="text-red-500 font-mst line-clamp-1 text-16 whitespace-nowrap"
        >
          {{ statusTip }}
        </div>
        <!-- <input
          type="text"
          readonly
          class="text-zinc-400 text-12 focus:outline-none bg-transparent block w-full"
          :value="props.src"
        /> -->
      </div>
      <button
        class="focus-control text-32 text-active mx-auto block absolute bottom-3 right-4"
        v-if="status === ELoadStatus.FAILED"
        @click.stop.capture="() => handleReload(1000, true)"
      >
        <RefreshIcon />
      </button>
    </div>
    <!-- Loaded -->
    <div
      v-if="status === ELoadStatus.LOADED"
      @dblclick.stop.capture="
        () => {
          props.fullscreen ? handleCloseFullscreen() : handleOpenFullscreen()
        }
      "
      class="absolute top-0 left-0 z-10 w-full h-full flex items-center justify-center"
    >
      <button
        v-if="!props.fullscreen"
        @click.stop.capture="handleOpenFullscreen"
        class="focus-control absolute bottom-3 right-3 text-25 text-active bg-zinc-800 border border-active opacity-60 rounded-lg p-5 flex items-center cursor-pointer hover:opacity-100"
      >
        <FullscreenIcon />
      </button>
      <button
        v-else
        @click.stop.capture="handleCloseFullscreen"
        class="focus-control absolute bottom-3 right-3 text-25 text-active bg-zinc-800 border border-active opacity-60 rounded-lg p-5 flex items-center cursor-pointer hover:opacity-100"
      >
        <FullscreenExitIcon />
      </button>
    </div>

    <iframe
      ref="iframe"
      frameborder="0"
      allow="fullscreen"
      scrolling="no"
      class="w-full h-full overflow-hidden border-0"
    ></iframe>
  </div>
</template>
<script setup lang="ts">
import { nanoid } from 'nanoid'
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, Ref, watch, onBeforeUnmount, nextTick, computed } from 'vue'
import { useModelStore, useStreamStore } from '@renderer/store'
import { ELayout, ELoadStatus, ERouter, EPostMessageType } from '@renderer/types/defines'
import { playerIframeSrc } from '@renderer/api/api'
import {
  FullscreenIcon,
  FullscreenExitIcon,
  RefreshIcon,
  LoadingIcon
} from 'tdesign-icons-vue-next'

interface Props {
  src: string
  id: number | string
  fullscreen: boolean
}

const props = withDefaults(defineProps<Props>(), {})
const router = useRouter()
const streamStore = useStreamStore()
const modelStore = useModelStore()
const status: Ref<ELoadStatus | ''> = ref('')
const statusTip = ref('')
const iframe = ref()
const reconnectTimes = ref(0)
let iframeId = ''
let TT
const currentStream = computed(() => streamStore.streams[props.id])
const handleOpenFullscreen = () => {
  router.replace({
    name: ERouter.FULLSCREEN,
    params: { id: props.id }
  })
}

const handleCloseFullscreen = () => {
  router.replace({ name: ERouter.LIVE })
}
// reload or update player
const handleReload = (delay: number = 100, isResetReconnect: boolean = false) => {
  if (!(props.src && iframe.value)) return
  status.value = ELoadStatus.LOADING
  statusTip.value = ''
  if (isResetReconnect) {
    reconnectTimes.value = 0
  }
  iframeId && handleStopPlayer()
  iframeId = `${nanoid(20)}`
  nextTick(() => {
    TT = setTimeout(() => {
      if (iframe.value) {
        iframe.value.src = `${playerIframeSrc}?playerId=${iframeId}`
      }
    }, delay)
  })
}
// stop a player, and image stream receceiving by change iframe src
const handleStopPlayer = () => {
  if (iframe.value) iframe.value.src = ''
}
// handle with current player status
const handlePlayerStatus = (data: { value: ELoadStatus; remark?: string }) => {
  status.value = data.value
  switch (data.value) {
    case ELoadStatus.LOADING:
      break
    case ELoadStatus.LOADED:
      streamStore.updatePlayStatus(props.src, true)
      break
    case ELoadStatus.FAILED:
      try {
        let { gap, repeat } = currentStream.value.connection
        if (repeat > 0 && reconnectTimes.value < repeat) {
          reconnectTimes.value += 1
          handleReload(gap)
        } else {
          streamStore.updatePlayStatus(props.src, false)
          if (data.remark) {
            statusTip.value = data.remark
          }
        }
      } catch (err) {
        streamStore.updatePlayStatus(props.src, false)
        if (data.remark) {
          statusTip.value = data.remark
        }
      }
      break
  }
}

// handle different messages
const handleMessage = (e) => {
  if (!(e.origin === location.origin && e.data && e.data.playerId === iframeId)) return
  if (e.data.type === EPostMessageType.STREAM_DATA) return
  switch (e.data.type) {
    case EPostMessageType.IFRAME_ONLOAD:
      props.src &&
        iframe.value &&
        iframe.value.contentWindow.postMessage({
          type: EPostMessageType.STREAM_DATA,
          playerId: iframeId,
          playerUrl: props.src,
          timeout: currentStream.value.connection?.timeout
        })
      break
    case EPostMessageType.PLAYER_STATUS:
      handlePlayerStatus(e.data)
      break
  }
}
// remove all event and stop current player
onBeforeUnmount(() => {
  handleStopPlayer()
  TT && clearTimeout(TT)
  window.removeEventListener('message', handleMessage)
})

// remove all event and stop current player
window.addEventListener('beforeunload', () => {
  handleStopPlayer()
  window.removeEventListener('message', handleMessage)
})

// trigger reload player
watch(
  () => props.src,
  (val) => {
    if (!val) {
      return
    }
    handleReload(currentStream.value?.connection?.gap || 2000)
  }
)

// listening posting message & initial the player
onMounted(() => {
  window.addEventListener('message', handleMessage, false)
  handleReload(currentStream.value?.connection?.gap || 2000)
})
</script>
<style lang=""></style>
