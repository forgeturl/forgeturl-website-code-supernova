// 环境配置
const configs = {
    local: {
        API_BASE_URL: 'http://127.0.0.1:80',
        WEBSITE_URL: 'http://localhost:3000'
    },
    test: {
        API_BASE_URL: 'https://test-api.brightguo.com',
        WEBSITE_URL: 'https://test.forgeturl.com'
    },
    onl: {
        API_BASE_URL: 'https://api.brightguo.com',
        WEBSITE_URL: 'https://forgeturl.com'
    }
}

// 获取当前环境
function getCurrentEnv() {
    const hostname = window.location.hostname

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'local'
    } else if (hostname.includes('test')) {
        return 'test'
    } else {
        return 'onl'
    }
}

export const config = configs[getCurrentEnv()]

// API 基础URL
export const API_BASE_URL = config.API_BASE_URL

// 网站基础URL
export const WEBSITE_URL = config.WEBSITE_URL

// 导出当前环境
export const CURRENT_ENV = getCurrentEnv()
