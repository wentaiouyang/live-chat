import axios from 'axios'
import config from '@/config'

// Create Axios Instance
const apiClient = axios.create({
  baseURL: `${config.apiBaseUrl}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 秒超时
})

// Request Interceptor: Attach Token
apiClient.interceptors.request.use(
  (config) => {
    console.log('🚀 API 请求:', config.method?.toUpperCase(), config.url, config.data)
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error('❌ 请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API 响应:', response.config.url, response.status, response.data)
    return response
  },
  (error) => {
    console.error('❌ API 错误:', error.config?.url, error.message, error.response?.data)
    return Promise.reject(error)
  }
)

export default apiClient
