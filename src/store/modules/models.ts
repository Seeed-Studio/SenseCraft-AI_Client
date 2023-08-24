import { defineStore } from "pinia"
import { IModel } from "@renderer/types/model"
import { ELoadStatus } from "@renderer/types/defines"


const store = defineStore('models', {
  state: () => {
    return {
      status: '',
      models: [] as IModel[]
    }
  },
  actions: {
    updateStatus(value?: ELoadStatus){
      this.status = value || ''
    },
    updateModels(data: IModel[]) {
      this.models = data
    }
  }
})
export default store
