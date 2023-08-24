<template>
  <div>{{currentDate.date}} {{currentDate.time}}</div>
  <!-- <div>{{ currentDate }}</div> -->
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue"
import { getCurrentTime } from "@renderer/utils"
let currentDate = ref(getCurrentTime())
// let currentDate = ref(new Date().toLocaleString())

const TT = setInterval(() => {
  currentDate.value = getCurrentTime()
//   currentDate.value = new Date().toLocaleString()
}, 1000)
onUnmounted(() => {
  clearInterval(TT)
})
</script>

<style>
/* 添加样式，根据需要自定义 */
</style>
