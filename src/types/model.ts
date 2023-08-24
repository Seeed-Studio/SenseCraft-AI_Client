export interface IModel {
  downloadUrl: string
  name: string
  size: number
  icon: string
  arguments: {
    uuid: string
    type: string
    half: boolean
  }
}
