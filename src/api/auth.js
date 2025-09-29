import request from '../utils/request'

// 登录相关接口
export const authAPI = {
    // 获取第三方登录URL
    getAuthUrl(provider, code = '') {
        return request.get(`/login/connector/auth`, {
            params: { provider, code }
        })
    },

    // 第三方登录回调
    authCallback(provider, code) {
        return request.get(`/login/connector/callback/${provider}`, {
            params: code ? { code } : {}
        })
    },

    // 登出
    logout() {
        return request.post('/login/logout')
    }
}
