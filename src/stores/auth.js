import { defineStore } from 'pinia'
import { authAPI } from '../api/auth'
import { storage, STORAGE_KEYS } from '../utils/storage'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null,
        isLoggedIn: false
    }),

    getters: {
        userInfo: (state) => state.user,
        isAuthenticated: (state) => state.isLoggedIn
    },

    actions: {
        // 初始化，从本地存储恢复登录状态
        init() {
            const token = storage.get(STORAGE_KEYS.TOKEN)
            const userInfo = storage.get(STORAGE_KEYS.USER_INFO)

            if (token) {
                this.token = token
                this.user = userInfo
                this.isLoggedIn = true
            }
        },

        // 第三方登录
        async loginWithProvider(provider) {
            try {
                // 获取授权URL
                const response = await authAPI.getAuthUrl(provider)
                if (response && response.auth_url) {
                    window.location.href = response.auth_url
                }
            } catch (error) {
                console.error('获取授权URL失败:', error)
                throw error
            }
        },

        // 处理登录回调
        async handleAuthCallback(provider) {
            try {
                const response = await authAPI.authCallback(provider)
                if (response) {
                    this.user = response
                    this.token = response.token || ''
                    this.isLoggedIn = true

                    // 保存到本地存储
                    storage.set(STORAGE_KEYS.TOKEN, this.token)
                    storage.set(STORAGE_KEYS.USER_INFO, this.user)

                    return response
                }
            } catch (error) {
                console.error('登录回调处理失败:', error)
                throw error
            }
        },

        // 登出
        async logout() {
            try {
                await authAPI.logout()

                // 清除本地存储
                storage.remove(STORAGE_KEYS.TOKEN)
                storage.remove(STORAGE_KEYS.USER_INFO)

                // 重置状态
                this.user = null
                this.token = null
                this.isLoggedIn = false
            } catch (error) {
                console.error('登出失败:', error)
                // 即使API调用失败，也要清除本地状态
                storage.remove(STORAGE_KEYS.TOKEN)
                storage.remove(STORAGE_KEYS.USER_INFO)
                this.user = null
                this.token = null
                this.isLoggedIn = false
            }
        },

        // 更新用户信息
        updateUserInfo(userInfo) {
            this.user = { ...this.user, ...userInfo }
            storage.set(STORAGE_KEYS.USER_INFO, this.user)
        },

        // 清除登录状态（不调用API）
        clearAuth() {
            storage.remove(STORAGE_KEYS.TOKEN)
            storage.remove(STORAGE_KEYS.USER_INFO)
            this.user = null
            this.token = null
            this.isLoggedIn = false
        }
    }
})
