import { defineStore } from "pinia"
import { IStream } from "@renderer/types/stream"
import { frameSrc } from "@renderer/api/api"
import { ELoadStatus } from "@renderer/types/defines"

export const emptyStreamConf: IStream = {
  name: `New Stream`,
  modelId: "",
  sourceType: "",
  sourcePath: "",
  customer_enabled: true,
  customer_is_living: false,
  streamInfo: {
    fps: 20,
    quality: 30,
    show_box: 1,
    track: 0,
    half: 1,
    conf: 0.5,
    max_det: 50,
    show_fps: 0,
    show_time: 1
  },
  connection: {
    repeat: 2,
    gap: 1000 * 3,
    timeout: 1000 * 60,
  }
}

const getPlayURl = (stream: IStream) => {
  if (!(stream.customer_enabled && stream.sourcePath)) {
    return ""
  }
  let { sourcePath, modelId, streamInfo } = stream as IStream
  let params = ""
  if (stream.streamInfo) {
    for (let key in streamInfo) {
      let value = streamInfo[key]
      if (value !== void 0 && value !== "") {
        params += `&${key}=${value}`
      }
    }
  }
  return `${frameSrc}?src=${sourcePath}&model_id=${stream.modelId}${params}`
}

const store = defineStore("streams", {
  state: () => {
    return {
      status: "",
      streams: []
    }
  },
  getters: {},
  actions: {
    updateStatus(value?: ELoadStatus) {
      this.status = value || ""
    },
    updateStream(stream: IStream, idx: number) {
      if (!stream.playUrl) stream.playUrl = getPlayURl(stream)
      this.streams.splice(idx, 1, stream)
    },

    updatePlayStatus(src: string, canPlay: boolean) {
      this.streams.forEach((item, idx) => {
        if (item.playUrl === src) {
          let stream = this.streams[idx]
          this.updateStream({ ...stream, customer_is_living: canPlay }, idx)
        }
      })
    },
    updateAllStreams(streams: IStream[], isInit: boolean = true) {
      if (streams.length === 0) {
        this.streams = []
        return
      }
      let dataLen = streams.length
      for (let i = 0; i < dataLen; i++) {
        let item = streams[i]
        if (!item.name) {
          item = { ...emptyStreamConf }
        }
        if (!item.streamInfo) {
          item.streamInfo = emptyStreamConf.streamInfo
        } else {
          for (let key in emptyStreamConf.streamInfo) {
            if (item.streamInfo[key] === void 0) {
              item.streamInfo[key] = emptyStreamConf.streamInfo[key]
            }
          }
        }
        if (!item.connection) {
          item.connection = emptyStreamConf.connection
        } else {
          for (let key in emptyStreamConf.connection) {
            if (item.connection[key] === void 0) {
              item.connection[key] =
                emptyStreamConf.connection[key]
            }
          }

        }
        if (isInit) item.customer_is_living = false
        item.playUrl = getPlayURl(item)
        // this.streams.splice(i, 1, item)
      }
      this.streams = [...streams]
    }
  }
})
export default store
