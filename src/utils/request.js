import axios from 'axios'
import { API_BASE_URL } from './config'

// 创建 axios 实例
const request = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// 请求拦截器
request.interceptors.request.use(
    config => {
        // 从本地存储获取 token
        const token = localStorage.getItem('forgeturl_token')
        if (token) {
            config.headers['X-Token'] = token
        }

        // 在callback请求中携带x-forget-cookie
        if (config.url && config.url.includes('/login/connector/callback')) {
            const forgetCookie = localStorage.getItem('forgeturl_forget_cookie')
            if (forgetCookie) {
                config.headers['x-forget-cookie'] = forgetCookie
            }
        }

        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// 响应拦截器
request.interceptors.response.use(
    response => {
        const res = response.data

        // 如果响应头中有X-Token，保存到localStorage
        const token = response.headers['x-token']
        if (token) {
            localStorage.setItem('forgeturl_token', token)
        }

        // 如果响应头中有x-forget-cookie，保存到localStorage
        const forgetCookie = response.headers['x-forget-cookie']
        if (forgetCookie) {
            localStorage.setItem('forgeturl_forget_cookie', forgetCookie)
        }

        // 检查响应格式
        if (res.code !== 0 && res.code !== 1) {
            // 错误处理
            console.error('API Error:', res.msg || 'Unknown error')
            return Promise.reject(new Error(res.msg || 'Unknown error'))
        }

        return res.data
    },
    error => {
        console.error('Request Error:', error)
        return Promise.reject(error)
    }
)

export default request
