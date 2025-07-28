import { createAlova } from 'alova'
import adapterFetch from 'alova/fetch'
import VueHook from 'alova/vue'

export const userAlova = createAlova({
  baseURL: import.meta.env.VITE_BASE_API,
  timeout: 99999,
  statesHook: VueHook,
  requestAdapter: adapterFetch(),
  async beforeRequest(method) {
    method.config.headers.token = 'user token'
  },
  responded: (response) => {
    if (response.status !== 200) {
      throw new Error(`[${response.status}]${response.statusText}`)
    }
    return response.json()
  },
})
