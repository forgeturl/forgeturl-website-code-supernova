/**
 * 截断字符串
 * @param {string} str - 要截断的字符串
 * @param {number} length - 最大长度
 * @param {string} suffix - 后缀，默认为 '...'
 * @returns {string} 截断后的字符串
 */
export const truncate = (str, length, suffix = '...') => {
    if (!str || str.length <= length) return str
    return str.slice(0, length) + suffix
}

/**
 * 首字母大写
 * @param {string} str - 要转换的字符串
 * @returns {string} 首字母大写的字符串
 */
export const capitalize = (str) => {
    if (!str) return str
    return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * 驼峰转连字符
 * @param {string} str - 驼峰字符串
 * @returns {string} 连字符字符串
 */
export const camelToKebab = (str) => {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

/**
 * 连字符转驼峰
 * @param {string} str - 连字符字符串
 * @returns {string} 驼峰字符串
 */
export const kebabToCamel = (str) => {
    return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase())
}

/**
 * 生成随机字符串
 * @param {number} length - 字符串长度
 * @param {string} chars - 字符集，默认为字母数字
 * @returns {string} 随机字符串
 */
export const randomString = (length = 8, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') => {
    let result = ''
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

/**
 * 提取域名
 * @param {string} url - URL字符串
 * @returns {string} 域名
 */
export const extractDomain = (url) => {
    if (!url) return ''
    try {
        const urlObj = new URL(url)
        return urlObj.hostname
    } catch {
        return url.split('/')[0]
    }
}

/**
 * 验证URL格式
 * @param {string} url - 要验证的URL
 * @returns {boolean} 是否是有效的URL
 */
export const isValidUrl = (url) => {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}

/**
 * 格式化URL显示
 * @param {string} url - URL字符串
 * @param {number} maxLength - 最大显示长度
 * @returns {string} 格式化后的URL
 */
export const formatUrl = (url, maxLength = 50) => {
    if (!url) return ''
    if (url.length <= maxLength) return url

    const domain = extractDomain(url)
    const path = url.replace(/^https?:\/\//, '').replace(domain, '')

    if (domain.length + path.length <= maxLength) {
        return `${domain}${path}`
    }

    return `${domain}${truncate(path, maxLength - domain.length - 3, '...')}`
}

/**
 * 生成唯一ID
 * @param {string} prefix - 前缀
 * @returns {string} 唯一ID
 */
export const generateId = (prefix = 'id') => {
    return `${prefix}_${Date.now()}_${randomString(6)}`
}
