import request from '../utils/request'

// 登录相关接口
export const authAPI = {
    // 获取第三方登录URL
    getAuthUrl(provider, code = '') {
        return request.get(`/login/connector/auth/${provider}`, {
            params: { code }
        })
    },

    // 第三方登录回调
    authCallback(provider) {
        return request.get(`/login/connector/callback/${provider}`)
    },

    // 登出
    logout() {
        return request.post('/login/logout')
    }
}
