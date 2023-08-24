<template lang="">
  <button tabindex="0" class="focus-control flex items-center pl-20 py-11 cursor-pointer text-30" @click="handleRouterBack">
    <ChevronLeftIcon />
  </button>
</template>
<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router'
import { ChevronLeftIcon } from 'tdesign-icons-vue-next'
const route = useRoute()
const router = useRouter()

const handleRouterBack = () => {
  const backPage = route.meta.backPage || route.matched[route.matched.length - 2]
  backPage ? router.replace(backPage) : router.go(-1)
}
</script>
<style lang=""></style>
