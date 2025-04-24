import axios from 'axios'

const service = axios.create({
  // baseURL: import.meta.env.VITE_BASE_API,
  baseURL: 'http://localhost:3000',
  timeout: 99999,
})

export default service
