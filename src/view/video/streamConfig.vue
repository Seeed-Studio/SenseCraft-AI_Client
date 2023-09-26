<template>
  <div class="p-20" v-if="stream">
    <template v-if="isMounted">
      <Teleport :to="'#' + ELayout.SUB_HEADER_RIGHT">
        <div class="flex items-center justify-end pr-30 w-full box-border">
          <t-button
            @click="() => handleSave()"
            class="focus-control w-full"
            size="large"
          >
            <span v-if="saveLoading"><LoadingIcon /></span>
            <span v-else class="font-mst-b text-white text-16">
              {{ $t("save") }}</span
            >
          </t-button>
        </div>
      </Teleport>
      <Teleport :to="'#' + ELayout.SUB_HEADER_CENTER">
        <span>{{ formData.name }}</span>
      </Teleport>
    </template>
    <div
      class="list px-30 py-15 pt-25 m-auto rounded-component bg-white dark:bg-dark-component-bg relative"
    >
      <t-form
        ref="form"
        :status-icon="true"
        :data="formData"
        :rules="rules"
        :requiredMark="false"
        lable-align="right"
        label-width="140px"
      >
        <template #statusIcon="{ value }"> </template>
        <t-form-item name="">
          <template #label>
            <div class="form-item-title">{{ t("enabled") }}</div>
          </template>
          <t-switch v-model="formData.customer_enabled" size="large" />
        </t-form-item>
        <t-divider></t-divider>
        <t-form-item name="name">
          <template #label>
            <div class="form-item-title">{{ $t("streamName") }}</div>
          </template>

          <t-input
            borderless
            size="large"
            v-model="formData.name"
            placeholder=""
          ></t-input>
        </t-form-item>
        <t-form-item name="modelId">
          <template #label>
            <div class="form-item-title">{{ $t("model") }}</div>
          </template>
          <t-select
            borderless
            size="large"
            :loading="modelStore.status === ELoadStatus.LOADING"
            v-model="formData.modelId"
            placeholder=""
            :popup-props="{
              overlayInnerClassName: 'model-select-pop',
              placement: 'bottom-right'
            }"
          >
            <t-option
              v-for="item of modelStore.models"
              :key="item.arguments.uuid"
              :value="item.arguments.uuid"
              :label="item.name"
            >
              <button class="flex w-full items-center p-10">
                <span
                  class="w-50 h-50 rounded-full overflow-hidden border-2 border-zinc-900 box-border"
                  :class="{
                    'border-active': item.arguments.uuid === formData.modelId
                  }"
                >
                  <img
                    :src="item.icon"
                    class="block object-cover w-full h-full"
                    alt=""
                  />
                </span>
                <div class="pl-10 break-words whitespace-normal text-left">
                  {{ item.name }}
                </div>
              </button>
            </t-option>
            <!-- <template #valueDisplay="{value: ()}">
                 {{}}
                </template> -->
            <template #suffixIcon>
              <ChevronDownIcon
                size="30"
                v-show="
                  modelStore.status !== ELoadStatus.LOADING &&
                  modelStore.models.length > 0
                "
              />
              <button
                @click="getAppConfig"
                v-if="
                  modelStore.status !== ELoadStatus.LOADING &&
                  modelStore.models.length === 0
                "
                class="text-active"
              >
                <RefreshIcon size="24" />
              </button>
            </template>
            <template #empty>
              <div class="text-center p-10">{{ t("empty") }}</div>
            </template>
            <template #loadingText>
              <div class="text-center p-20">
                <LoadingIcon size="20"></LoadingIcon>
              </div>
            </template>
          </t-select>
        </t-form-item>

        <!-- Video Type -->
        <t-form-item name="sourceType">
          <template #label>
            <div class="form-item-title">{{ $t("videoType") }}</div>
          </template>
          <t-select
            v-model="formData.sourceType"
            borderless
            size="large"
            placeholder="Video Types"
            :popup-props="{ placement: 'bottom-right' }"
          >
            <t-option
              v-for="item of sourceTypeOptions"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            >
              <button class="w-full items-center p-8">
                <div class="break-words whitespace-normal text-left">
                  {{ item.label }}
                </div>
              </button>
            </t-option>
            <template #suffixIcon>
              <ChevronDownIcon size="30" />
            </template>
          </t-select>
        </t-form-item>
        <!-- Source Path -->
        <t-form-item name="sourcePath">
          <template #label>
            <div class="form-item-title">{{ $t("videoPath") }}</div>
          </template>
          <template v-if="formData.sourceType">
            <t-select
              v-if="formData.sourceType === EVideoTypes.USB_CAMERA"
              :loading="loadingCamera"
              v-model="formData.sourcePath"
              placeholder=""
              size="large"
              :popup-props="{ placement: 'bottom-right' }"
            >
              <t-option
                v-for="item of cameraList"
                :key="item"
                :label="item"
                :value="item"
              >
                <button class="block w-full items-center p-8">
                  <div class="break-words whitespace-normal text-right">
                    {{ item }}
                  </div>
                </button>
              </t-option>
              <template #suffixIcon>
                <ChevronDownIcon
                  size="30"
                  v-show="!loadingCamera && cameraList.length > 0"
                />
                <button
                  @click="getCameraDevice"
                  v-if="!loadingCamera && cameraList.length === 0"
                  class="text-active"
                >
                  <RefreshIcon size="24" />
                </button>
              </template>
              <template #loadingText>
                <div class="text-center p-20">
                  <LoadingIcon size="20"></LoadingIcon>
                </div>
              </template>
              <template #empty>
                <div class="text-center p-10">{{ t("empty") }}</div>
              </template>
            </t-select>
            <t-input
              v-else
              align="right"
              inputClass="config-input-text"
              clearable
              placeholder=""
              v-model="formData.sourcePath"
              size="large"
              style="border: none"
            >
              <template #suffix-icon>
                <Edit1Icon size="20" />
              </template>
            </t-input>
          </template>
        </t-form-item>

        <template v-if="formData.streamInfo">
          <t-divider align="left"></t-divider>
          <t-form-item name="streamInfo.fps">
            <template #label>
              <div class="form-item-title">{{ t("fps") }}</div>
            </template>
            <div class="grow flex justify-end">
              <t-slider v-model="formData.streamInfo.fps" :max="100" :min="1" />
              <span
                class="text-16 ml-20 font-mst-b min-w-30 box-border text-left"
                >{{ formData.streamInfo.fps }}</span
              >
            </div>
          </t-form-item>

          <t-form-item name="streamInfo.quality">
            <template #label>
              <div class="form-item-title">{{ t("quality") }}</div>
            </template>
            <div class="grow flex justify-end">
              <t-slider v-model="formData.streamInfo.quality" :max="100" />
              <span
                class="text-16 ml-20 font-mst-b min-w-30 box-border text-left"
                >{{ formData.streamInfo.quality }}</span
              >
            </div>
          </t-form-item>
          <t-form-item name="streamInfo.max_det">
            <template #label>
              <div class="form-item-title">{{ t("maxDet") }}</div>
            </template>
            <div class="grow flex justify-end">
              <t-slider v-model="formData.streamInfo.max_det" :max="1000" />
              <span
                class="text-16 ml-20 font-mst-b min-w-30 box-border text-left"
                >{{ formData.streamInfo.max_det }}</span
              >
            </div>
          </t-form-item>
          <t-form-item name="streamInfo.conf">
            <template #label>
              <div class="form-item-title">{{ t("conf") }}</div>
            </template>
            <div class="grow flex justify-end">
              <t-slider
                v-model="formData.streamInfo.conf"
                :step="0.01"
                :max="1"
              />
              <span
                class="text-16 ml-20 font-mst-b min-w-30 box-border text-left"
                >{{ formData.streamInfo.conf }}</span
              >
            </div>
          </t-form-item>

          <t-form-item name="streamInfo.track">
            <template #label>
              <div class="form-item-title">{{ t("track") }}</div>
            </template>
            <t-switch
              :customValue="[1, 0]"
              v-model="formData.streamInfo.track"
              size="large"
            />
          </t-form-item>
          <t-form-item name="streamInfo.half">
            <template #label>
              <div class="form-item-title">{{ t("half") }}</div>
            </template>
            <t-switch
              :customValue="[1, 0]"
              v-model="formData.streamInfo.half"
              size="large"
            />
          </t-form-item>
          <t-form-item name="streamInfo.show_box">
            <template #label>
              <div class="form-item-title">{{ t("showBox") }}</div>
            </template>
            <t-switch
              :customValue="[1, 0]"
              v-model="formData.streamInfo.show_box"
              size="large"
            />
          </t-form-item>
          <t-form-item name="streamInfo.show_fps">
            <template #label>
              <div class="form-item-title">{{ t("showFps") }}</div>
            </template>
            <t-switch
              :customValue="[1, 0]"
              v-model="formData.streamInfo.show_fps"
              size="large"
            />
          </t-form-item>
          <t-form-item name="streamInfo.show_time">
            <template #label>
              <div class="form-item-title">{{ t("showTime") }}</div>
            </template>
            <t-switch
              :customValue="[1, 0]"
              v-model="formData.streamInfo.show_time"
              size="large"
            />
          </t-form-item>
        </template>
        <template v-if="formData.connection">
          <t-collapse
            :borderless="true"
            expandIconPlacement="right"
            class="bg-transparent"
            style="background-color: transparent"
          >
            <t-collapse-panel class="connection-setting">
              <template #header>
                <t-divider style="margin: 10px 0 10px 0">
                  <div class="text-16">{{ t("connectionSettings") }}</div>
                </t-divider>
              </template>

              <t-form-item name="connection.gap" label-width="220px">
                <template #label>
                  <div class="form-item-title">
                    {{ t("customer_gap") }}
                  </div>
                </template>
                <div class="grow flex justify-end">
                  <t-slider
                    v-model="formData.connection.gap"
                    :max="30 * 1000"
                    :min="0"
                    :step="100"
                    :tooltipProps="{
                      content: () =>
                        `${(formData.connection.gap / 1000).toFixed(1)}s`
                    }"
                  >
                  </t-slider>

                  <span
                    class="text-16 ml-20 font-mst-b min-w-30 box-border text-left"
                    >{{
                      `${(formData.connection.gap / 1000).toFixed(1)}s`
                    }}</span
                  >
                </div>
              </t-form-item>

              <t-form-item name="connection.timeout" label-width="220px">
                <template #label>
                  <div class="form-item-title">
                    {{ t("customer_timeout") }}
                  </div>
                </template>
                <div class="grow flex justify-end">
                  <t-slider
                    v-model="formData.connection.timeout"
                    :max="300 * 1000"
                    :min="5 * 1000"
                    :step="1000"
                    :tooltipProps="{
                      content: () =>
                        `${(formData.connection.timeout / 1000).toFixed()}s`
                    }"
                  />
                  <span
                    class="text-16 ml-20 font-mst-b min-w-30 box-border text-left"
                    >{{
                      `${(formData.connection.timeout / 1000).toFixed()}s`
                    }}</span
                  >
                </div>
              </t-form-item>

              <t-form-item name="connection.repeat" label-width="220px">
                <template #label>
                  <div class="form-item-title">
                    {{ t("customer_repeat") }}
                  </div>
                </template>
                <div class="grow flex justify-end">
                  <t-slider
                    v-model="formData.connection.repeat"
                    :max="60"
                    :min="0"
                  />
                  <span
                    class="text-16 ml-20 font-mst-b min-w-30 box-border text-left"
                    >{{ formData.connection.repeat }}</span
                  >
                </div>
              </t-form-item>
            </t-collapse-panel>
          </t-collapse>
        </template>
      </t-form>
      <div class="mt-40 flex justify-end w-full" v-if="!isNewStream">
        <button
          @click="handleDelete"
          class="delete text-red-500 hover:text-red-600 hover:bg-red-950 p-10 rounded-component"
        >
          <LoadingIcon
            v-if="saveLoading && currentOpera === EStreamOpera.DELETE"
          />
          <DeleteIcon v-else size="30" />
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  EVideoTypes,
  ELayout,
  ELoadStatus,
  EStreamOpera
} from "@renderer/types/defines"
import { useRoute, useRouter } from "vue-router"
import { useModelStore, useStreamStore } from "@renderer/store"
import {
  reactive,
  ref,
  computed,
  onMounted,
  watch,
  Ref,
  watchEffect
} from "vue"
import {
  Edit1Icon,
  ChevronDownIcon,
  RefreshIcon,
  CheckIcon,
  LoadingIcon,
  CloseCircleFilledIcon
} from "tdesign-icons-vue-next"
import { getCameras, setStreamsConfig } from "@renderer/api"
import { emptyStreamConf } from "@renderer/store/modules/streams"
import { MessagePlugin } from "tdesign-vue-next"
import { DeleteIcon } from "tdesign-icons-vue-next"
import { getAppConfig } from "@renderer/api"
import i18n from "@renderer/i18n"

const { t, tm } = i18n.global
const modelStore = useModelStore()
const streamStore = useStreamStore()
const route = useRoute()
const router = useRouter()
const stream =
  streamStore.streams.find((item, idx) => idx + "" === route.params?.id) ||
  emptyStreamConf

const isMounted = ref(false)
const form = ref()
const sourceTypeOptions = [
  { label: t("videoFile"), value: EVideoTypes.VIDEO_FILE },
  { label: t("ipCamera"), value: EVideoTypes.IP_CAMERA },
  { label: t("usbCamera"), value: EVideoTypes.USB_CAMERA }
]
const isNewStream = computed(() => {
  return route.params?.id === "new"
})

const formData = reactive({ ...stream })
const rules = {
  name: [
    {
      required: true,
      whitespace: true,
      trigger: "change",
      message: t("validate.required")
    },
    {
      max: 25,
      message: t("validate.max", { size: 30 })
    }
  ]
}

// local Camera Device
const cameraList = ref([] as string[])
const loadingCamera = ref(false)
const saveLoading = ref(false)
const currentOpera = ref("")

const getCameraDevice = async () => {
  loadingCamera.value = true
  try {
    let res: unknown = await getCameras()
    if (res && (res as string[]).length > 0) {
      cameraList.value = res as string[]
      if (!formData.sourcePath) formData.sourcePath = res[0]
    } else {
      cameraList.value = []
    }

    loadingCamera.value = false
  } catch (err) {
    loadingCamera.value = false
  }
}

const handleSave = (opera?: EStreamOpera) => {
  if (saveLoading.value) return
  currentOpera.value = ""
  form.value.validate().then((result) => {
    if (opera === void 0) {
      opera = isNewStream.value ? EStreamOpera.CREATE : EStreamOpera.MODIFY
    }
    if (!(result === true || opera === EStreamOpera.DELETE)) return
    saveLoading.value = true
    currentOpera.value = opera
    setStreamsConfig(opera, { ...formData }, Number(route.params?.id))
      .then(() => {
        MessagePlugin.success({
          content: t("success"),
          duration: 800,
          className: "success-tip",
          onDurationEnd: () => {
            saveLoading.value = false
            const backPage = route.meta.backPage
            backPage && router.replace(backPage)
          }
        })
      })
      .catch((err) => {
        saveLoading.value = false
        MessagePlugin.error({ content: t("streamSaveFailed"), duration: 1000 })
      })
  })
}

const handleDelete = () => handleSave(EStreamOpera.DELETE)

watch(
  () => formData.sourceType,
  (val) => {
    formData.sourcePath = ""
    val === EVideoTypes.USB_CAMERA && getCameraDevice()
  }
)

onMounted(() => {
  isMounted.value = true
  formData.sourceType === EVideoTypes.USB_CAMERA && getCameraDevice()
})
</script>
<style lang="scss" scoped>
.list,
.delete {
  max-width: 810px;
}
.item {
  & + .item {
    border-top: 1px solid var(--border-color);
  }
}
</style>
<style lang="scss">
.t-popup__content {
  background-color: var(--component-bg);
  opacity: 1;
}
.t-select__list .t-select-option {
  background-color: transparent;
  padding: 0 0 0 0;
  height: auto;
}
.t-select__list .t-select-option.t-is-selected {
  background-color: transparent;
}
.t-input__inner {
  font-family: "Montserrat-SemiBold";
  text-align: right;
  // color: var(--primary-color);
}
.t-input {
  border: none;
}
.t-form__controls {
  text-align: right;
}
.model-select-pop {
  width: max-content;
  max-width: 80vw;
}
.form-item-title {
  font-family: "Montserrat-SemiBold";
  font-size: 16px;
}
.success-tip {
  color: var(--primary-color);
  background: var(--component-bg);
  box-shadow: 0 0 5px;
  padding: 8px 10px;
  opacity: 0.6;
  display: flex;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  svg {
    margin-right: 6px;
  }
}
.connection-setting .t-collapse-panel__wrapper .t-collapse-panel__body {
  background-color: transparent;
}
</style>
