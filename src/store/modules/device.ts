import { defineStore } from 'pinia'
const store = defineStore('device', {
  state: () => {
    return {
        version: {},
        deviceInfo: {},
    }
  },
  actions:{
    
  },
  persist: {}
})
export default store
