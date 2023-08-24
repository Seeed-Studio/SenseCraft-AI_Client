<template lang="">
  <div class="setting-container p-20">
    <div
      class="setting-list py-15 px-30 m-auto rounded-component bg-white dark:bg-dark-component-bg"
    >
      <button
        v-for="item of settingList"
        @click="
          () => {
            router.replace({ name: item.name })
          }
        "
        class="block w-full focus-control setting-item py-20 cursor-pointer"
      >
        <div class="flex items-center justify-between text-16 font-mst-b">
          <span>{{ item.meta.title }}</span>
          <div><ChevronRightIcon size="27" /></div>
        </div>
      </button>
      <div class="block w-full focus-control setting-item py-20 cursor-pointer">
        <div class="flex items-center justify-between text-16 font-mst-b">
          <span>{{ t("syncModels") }}</span>
          <t-button @click="handleSyncModel">
            <div class="flex items-center justify-center">
              <span class="px-5">{{ t("sync") }}</span>
              <LoadingIcon v-show="syncLoading" />
            </div>
          </t-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ChevronRightIcon } from "tdesign-icons-vue-next"
import { settingRouterList } from "@renderer/router"
import { useRouter } from "vue-router"
import { syncModel, getAppConfig } from "@renderer/api"
import { MessagePlugin } from "tdesign-vue-next"
import { ref } from "vue"
import { LoadingIcon } from "tdesign-icons-vue-next"
import i18n from "@renderer/i18n"
const { t } = i18n.global

const settingList = settingRouterList()
const router = useRouter()
const syncLoading = ref(false)
const handleSyncModel = async () => {
  if (syncLoading.value) return
  syncLoading.value = true
  try {
    await syncModel()
    await getAppConfig()
    MessagePlugin.success({
          content: t("success"),
          duration: 800,
      onDurationEnd: () => {
        syncLoading.value = false
      }
    })
  } catch (err) {
    syncLoading.value = false
    MessagePlugin.error(t("failed"))
  }
}
</script>
<style lang="scss" scoped>
.setting-list {
  max-width: 580px;
}
.setting-item {
  & + .setting-item {
    border-top: 1px solid var(--border-color);
  }
}
</style>
