import service from "@renderer/utils/request"
import qs from "qs"
import * as api from "./api"

import { useStreamStore, useModelStore } from "@renderer/store"
import { ELoadStatus, EStreamOpera } from "@renderer/types/defines"
import i18n from "@renderer/i18n"
import { IStream } from "@renderer/types/stream"
const { t, tm } = i18n.global


export const getVersionInfo = () => {
  return service.get(api.versionInfo)
}

export const getCameras = () => {
  return service.get(api.cameraDevices)
}

export const syncModel = () => {
  return service.post(api.syncModel)
}

export const readAppConf = () => {
  return service.get(api.appConfigs)
}

export const getDeviceInfo = () => {
  return service.get(api.deviceInfo)
}

export const writeAppConf = (data) => {
  return service.post(api.appConfigs, data)
}

export const handleAppConfig = (conf) => {
  const streamStore = useStreamStore()
  const modelStore = useModelStore()
  let streams = conf["streams"],
    models = conf["models"]
  let isEmptyStreams = !(streams && streams.length > 0)
  let isEmptyModels = !(models && models["modeList"].length > 0)
  streamStore.updateStatus(ELoadStatus.LOADED)
  modelStore.updateStatus(ELoadStatus.LOADED)
  streamStore.updateAllStreams(streams)
  modelStore.updateModels(models["modeList"])
}

export const getAppConfig = async () => {
  const streamStore = useStreamStore()
  if (streamStore.status === ELoadStatus.LOADING) return
  const modelStore = useModelStore()
  modelStore.updateStatus(ELoadStatus.LOADING)
  streamStore.updateStatus(ELoadStatus.LOADING)
  try {
    let res = await readAppConf()
    return handleAppConfig(res)
  } catch (err) {
    console.log(err)
    modelStore.updateStatus(ELoadStatus.FAILED)
    streamStore.updateStatus(ELoadStatus.FAILED)
    return Promise.reject(err)
  }
}

export const setStreamsConfig = async (
  operaType: EStreamOpera = EStreamOpera.MODIFY,
  stream: IStream | null,
  streamIdx?: number
) => {
  const streamStore = useStreamStore()
  if (streamStore.status === ELoadStatus.LOADING) {
    return
  }
  let streams = [...streamStore.streams]
  switch (operaType) {
    case EStreamOpera.CREATE:
      stream && streams.push(stream)
      break
    case EStreamOpera.DELETE:
      streamIdx >= 0 && streams.splice(streamIdx, 1)
      break
    default:
      stream && streamIdx >= 0 && streams.splice(streamIdx, 1, stream)
  }

  const modelStore = useModelStore()
  modelStore.updateStatus(ELoadStatus.LOADING)
  streamStore.updateStatus(ELoadStatus.LOADING)
  try {
    let res = await writeAppConf({ streams })
    modelStore.updateStatus()
    streamStore.updateStatus()
    if (res["configs"]) {
      return handleAppConfig(res["configs"])
    }
  } catch (err) {
    console.log(err)
    modelStore.updateStatus(ELoadStatus.FAILED)
    streamStore.updateStatus(ELoadStatus.FAILED)
    return Promise.reject(err)
  }
}
