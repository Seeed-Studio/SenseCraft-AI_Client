<template lang="">
  <div class="p-20 min-h-400 relative">
    <template v-if="!deivceStore.deviceInfo.sn">
      <div
        class="absolute top-0 left-0 h-full w-full flex justify-center items-center text-active"
        v-if="loading === ELoadStatus.LOADING"
      >
        <button><LoadingIcon size="30" /></button>
      </div>

      <div
        class="absolute top-0 left-0 h-full w-full flex justify-center items-center text-active"
        v-else
      >
        <button @click="getData"><RefreshIcon size="30" /></button>
      </div>
    </template>

    <div
      v-else
      class="list px-30 pb-50 py-15 m-auto rounded-component bg-white dark:bg-dark-component-bg relative"
    >
      <div
        v-for="item of deviceData"
        class="focus-control w-full item block py-10 cursor-pointer"
      >
        <div
          class="flex items-center justify-between text-16 font-mst-b min-h-60"
        >
          <div>{{ item.label }}</div>
          <div class="flex justify-end items-center">
            <div class="min-w-300" v-if="item.percentage !== void 0">
              <t-progress
                size="large"
                theme="line"
                strokeWidth="5"
                :percentage="item.percentage"
              >
                <template #label>
                  <span class="text-16 font-mst-b" v-if="!item.total"
                    >{{ item.percentage }}%</span
                  >
                </template>
              </t-progress>
              <!-- <span class="pl-10">{{ item.percentag }}%</span> -->
              <div class="text-right mt-8" v-if="item.total">
                <span class="text-14 font-mst"
                  >{{ item.value }}{{ item.unit }} / {{ item.total
                  }}{{ item.unit }}</span
                >
              </div>
            </div>
            <div v-else>
              {{ item.content }}
            </div>
          </div>
        </div>
      </div>
      <div
        class="absolute bottom-0 right-0 p-20 text-active"
        v-if="loading === ELoadStatus.LOADING"
      >
        <LoadingIcon size="30" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, computed } from "vue"
import { getDeviceInfo } from "@renderer/api"
import i18n from "@renderer/i18n"
import { useDeviceStore } from "@renderer/store"
import { LoadingIcon, RefreshIcon } from "tdesign-icons-vue-next"
import { MessagePlugin } from "tdesign-vue-next"
import { ELoadStatus } from "@renderer/types/defines"
import { IDevice } from "@renderer/types/device"
import { parse } from "path"
const { t } = i18n.global
const deivceStore = useDeviceStore()
const convert2Percent = (val: string) => {
  let arr = val.split("/")
  if (arr.length !== 2) return
  let value = Number(arr[0])
  let total = Number(arr[1])
  let result = value / total
  if (isNaN(result)) return null
  return {
    value,
    total: total,
    float: result.toFixed(2),
    percentage: parseFloat((result * 100).toFixed(2))
  }
}

const MB2GB = (value: number, toFix: number = 2) => {
  return (value / 1024).toFixed(2)
}

const list = [
  {
    label: t("device.product_type"),
    key: "product_type"
  },
  {
    label: t("device.ip_address"),
    key: "ip_address"
  },
  {
    label: t("device.sn"),
    key: "sn"
  },
  {
    label: t("device.mac_address"),
    key: "mac_address"
  },
  {
    label: t("device.cpu_usage"),
    key: "cpu",
    unit: "%",
    type: "process"
  },
  {
    label: t("device.ram"),
    key: "ram",
    switchUnit: MB2GB,
    unit: "GB",
    type: "process",
    convert: convert2Percent
  },
  {
    label: t("device.swap"),
    key: "swap",
    unit: "GB",
    switchUnit: MB2GB,
    type: "process",
    convert: convert2Percent
  },
  {
    label: t("device.disk_usage"),
    key: "disk_usage",
    unit: "GB",
    switchUnit: MB2GB,
    type: "process",
    convert: convert2Percent
  },
  {
    label: t("device.cuda_version"),
    key: "cuda_version"
  },
  {
    label: t("device.jetpack_version"),
    key: "jetpack_version"
  }
]
const loading = ref()
const getData = async () => {
  loading.value = ELoadStatus.LOADING
  try {
    let res = await getDeviceInfo()
    let formatData = handleData(res)
    deivceStore.deviceInfo = res
    loading.value = ELoadStatus.LOADED
  } catch (err) {
    loading.value = ELoadStatus.FAILED
    MessagePlugin.error(t("failed"))
  }
}
const handleData = (data) => {
  try {
    const formatData = list.map((item) => {
      let key = item.key
      if (!data[key]) {
        return { ...item, content: `${data[key]}${item.unit || ""}` }
      }
      if (!item.convert) {
        return item.type === "process"
          ? { ...item, percentage: Number(data[key]) }
          : { ...item, content: `${data[key]}${item.unit || ""}` }
      }
      let result = item.convert(data[key])
      if (item.switchUnit) {
        ;(result.value as unknown as string) = item.switchUnit(result.value)
        ;(result.total as unknown as string) = item.switchUnit(result.total)
      }
      if (!result) return { ...item, value: data[key] }
      return {
        ...item,
        ...result,
        content: `${result.value}${item.unit || ""}`
      }
    })
    return formatData
  } catch (err) {
    return data
  }
}
getData()
const deviceData = computed(() => {
  return handleData(deivceStore.deviceInfo)
})
</script>
<style lang="scss" scoped>
.list {
  max-width: 810px;
}
.item {
  & + .item {
    border-top: 1px solid var(--border-color);
  }
}
</style>
