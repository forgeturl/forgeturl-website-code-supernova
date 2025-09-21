// 本地存储工具类
class Storage {
    constructor() {
        this.prefix = 'forgeturl_'
    }

    // 获取带前缀的key
    getKey(key) {
        return `${this.prefix}${key}`
    }

    // 设置存储
    set(key, value) {
        try {
            const serializedValue = JSON.stringify(value)
            localStorage.setItem(this.getKey(key), serializedValue)
            return true
        } catch (error) {
            console.error('Storage set error:', error)
            return false
        }
    }

    // 获取存储
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(this.getKey(key))
            if (item === null) {
                return defaultValue
            }
            return JSON.parse(item)
        } catch (error) {
            console.error('Storage get error:', error)
            return defaultValue
        }
    }

    // 删除存储
    remove(key) {
        try {
            localStorage.removeItem(this.getKey(key))
            return true
        } catch (error) {
            console.error('Storage remove error:', error)
            return false
        }
    }

    // 清空所有存储
    clear() {
        try {
            // 只清空forgeturl前缀的数据
            const keys = Object.keys(localStorage)
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key)
                }
            })
            return true
        } catch (error) {
            console.error('Storage clear error:', error)
            return false
        }
    }

    // 检查是否支持本地存储
    isSupported() {
        try {
            const test = '__storage_test__'
            localStorage.setItem(test, test)
            localStorage.removeItem(test)
            return true
        } catch {
            return false
        }
    }
}

// 导出单例实例
export const storage = new Storage()

// 导出常用的存储key
export const STORAGE_KEYS = {
    USER_INFO: 'user_info',
    TOKEN: 'token',
    PREFERENCES: 'preferences',
    RECENT_PAGES: 'recent_pages'
}
