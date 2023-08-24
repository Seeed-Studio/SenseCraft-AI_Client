<template lang="">
  <div class="flex justify-between items-center">
    <div class="w-120"><BackButton /></div>
    <div
      class="w-auto grow flex justify-center items-center title text-18 font-mst-b max-w-400"
    >
      <div v-if="route.meta.title" class="line-clamp-1">
        {{ route.meta.title }}
      </div>
      <div :id="ELayout.SUB_HEADER_CENTER" class="line-clamp-1"></div>
      <slot :name="ELayout.SUB_HEADER_CENTER"></slot>
    </div>
    <div :id="ELayout.SUB_HEADER_RIGHT" class="w-120">
      <slot :name="ELayout.SUB_HEADER_RIGHT"></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useRoute } from "vue-router"
const route = useRoute()
import { ELayout } from "@renderer/types/defines"
</script>
<style lang=""></style>
