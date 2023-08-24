
const ENV = import.meta.env
const localPort = ENV.VITE_LOCAL_PORT || "46654"
let ROOT_API_PATH = ENV.VITE_API_PATH ? `${ENV.VITE_API_PATH}:${localPort}` : `${location.origin}:${localPort}`


// Image URL
export const frameSrc = `${ROOT_API_PATH}/stream`
// stream Config & Model List
export const appConfigs = `${ROOT_API_PATH}/appConfigs`
// version 
export const versionInfo = `${ROOT_API_PATH}/edge-ai/version/versions.json`
// sync remote model list
export const syncModel = `${ROOT_API_PATH}/syncCloudModel`
// camera list in device
export const cameraDevices = `${ROOT_API_PATH}/camList`
// about
export const deviceInfo = `${ROOT_API_PATH}/about`
// Iframe file path
export const playerIframeSrc = '/frame.html'
