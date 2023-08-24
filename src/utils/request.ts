import axios, { AxiosInstance, AxiosRequestConfig } from "axios"


const service: AxiosInstance = axios.create({
  timeout: 15 * 1000
})


service.interceptors.request.use(
  (config) => config,
  async (error) => {
    console.log(error)
    return await Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    if (![0, 200].includes(response.status)) {
      return Promise.reject(response)
    } else {
      return Promise.resolve(response.data)
    }
  },
  async (error) => {
    return await Promise.reject(error)
  }
)

export default service
