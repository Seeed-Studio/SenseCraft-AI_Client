<template>
  <router-view></router-view>
</template>
<script lang="ts" setup>
import { onMounted } from "vue"
import { useSystemStore } from "./store"

onMounted(() => {
  useSystemStore().initAppData()
})
</script>
