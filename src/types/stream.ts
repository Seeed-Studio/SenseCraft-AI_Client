

type IStreamInfo = {
  fps: number
  quality: number
  track: 0 | 1
  half: 0 | 1
  conf: number
  max_det: number
  show_box: 0 | 1
  show_fps : 0 | 1
  show_time : 0 | 1
}

export interface IStream {
  name: string
  modelId: string
  sourceType: string
  sourcePath: string
  playUrl?: string
  streamInfo: IStreamInfo
  customer_is_living: boolean
  customer_enabled: boolean
  connection: {
    repeat: number,
    gap: number,
    timeout: number
  }
}
