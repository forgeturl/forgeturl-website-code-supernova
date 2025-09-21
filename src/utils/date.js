import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

// 配置dayjs
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

/**
 * 格式化时间戳为可读格式
 * @param {number} timestamp - 时间戳（秒）
 * @param {string} format - 格式化模板，默认为 'YYYY-MM-DD HH:mm:ss'
 * @returns {string} 格式化后的时间字符串
 */
export const formatTime = (timestamp, format = 'YYYY-MM-DD HH:mm:ss') => {
    if (!timestamp) return '-'
    return dayjs(timestamp * 1000).format(format)
}

/**
 * 格式化时间戳为相对时间
 * @param {number} timestamp - 时间戳（秒）
 * @returns {string} 相对时间字符串
 */
export const formatRelativeTime = (timestamp) => {
    if (!timestamp) return '-'
    return dayjs(timestamp * 1000).fromNow()
}

/**
 * 格式化时间戳为日期
 * @param {number} timestamp - 时间戳（秒）
 * @returns {string} 日期字符串
 */
export const formatDate = (timestamp) => {
    return formatTime(timestamp, 'YYYY-MM-DD')
}

/**
 * 格式化时间戳为时间
 * @param {number} timestamp - 时间戳（秒）
 * @returns {string} 时间字符串
 */
export const formatTimeOnly = (timestamp) => {
    return formatTime(timestamp, 'HH:mm:ss')
}

/**
 * 获取当前时间戳（秒）
 * @returns {number} 当前时间戳
 */
export const getCurrentTimestamp = () => {
    return Math.floor(Date.now() / 1000)
}

/**
 * 判断是否是今天
 * @param {number} timestamp - 时间戳（秒）
 * @returns {boolean} 是否是今天
 */
export const isToday = (timestamp) => {
    if (!timestamp) return false
    const today = dayjs().startOf('day')
    const target = dayjs(timestamp * 1000).startOf('day')
    return today.isSame(target)
}

/**
 * 判断是否是昨天
 * @param {number} timestamp - 时间戳（秒）
 * @returns {boolean} 是否是昨天
 */
export const isYesterday = (timestamp) => {
    if (!timestamp) return false
    const yesterday = dayjs().subtract(1, 'day').startOf('day')
    const target = dayjs(timestamp * 1000).startOf('day')
    return yesterday.isSame(target)
}

/**
 * 智能格式化时间
 * @param {number} timestamp - 时间戳（秒）
 * @returns {string} 智能格式化的时间字符串
 */
export const smartFormatTime = (timestamp) => {
    if (!timestamp) return '-'

    const now = dayjs()
    const target = dayjs(timestamp * 1000)

    if (now.diff(target, 'hour') < 1) {
        return `${now.diff(target, 'minute')}分钟前`
    } else if (now.diff(target, 'day') < 1) {
        return `${now.diff(target, 'hour')}小时前`
    } else if (isToday(timestamp)) {
        return `今天 ${formatTimeOnly(timestamp)}`
    } else if (isYesterday(timestamp)) {
        return `昨天 ${formatTimeOnly(timestamp)}`
    } else if (now.diff(target, 'day') < 7) {
        return `${now.diff(target, 'day')}天前`
    } else {
        return formatTime(timestamp, 'YYYY-MM-DD')
    }
}
