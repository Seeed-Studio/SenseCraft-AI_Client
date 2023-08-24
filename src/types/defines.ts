// layout section name
export enum ELayout {
  SUB_HEADER_RIGHT = "SUB_HEADER_RIGHT",
  SUB_HEADER_CENTER = "SUB_HEADER_CENTER"
}

// router name 
export enum ERouter {
  STREAM_LIST = "stream-list",
  STREAM_CONFIG = "stream-config",
  LIVE = "live",
  FULLSCREEN = "fullscreen",
  SETTING = "setting",
  ABOUT = "about"
}

//  video type name
export enum EVideoTypes {
  VIDEO_FILE = "VideoFile",
  IP_CAMERA = "RTSP",
  USB_CAMERA = "CAM"
}


// status names
export enum ELoadStatus {
  LOADING = "loading",
  FAILED = "failed",
  LOADED = "loaded"
}

//  message types of window.postMessage
export enum EPostMessageType {
  IFRAME_ONLOAD = "IFRAME_ONLOAD",
  STREAM_DATA = "STREAM_DATA",
  PLAYER_STATUS = "PLAYER_STATUS"
}

// stream opera name 
export enum EStreamOpera {
  MODIFY = 'MODIFY',
  DELETE = 'DELETE',
  CREATE= 'CREATE'
}
