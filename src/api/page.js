import request from '../utils/request'

// 页面相关接口
export const pageAPI = {
    // 获取我的空间
    getMySpace() {
        return request.post('/space/getMySpace')
    },

    // 创建页面
    createPage(data) {
        return request.post('/space/createPage', data)
    },

    // 获取页面详情
    getPage(pageId) {
        return request.post('/space/getPage', { page_id: pageId })
    },

    // 更新页面
    updatePage(data) {
        return request.post('/space/updatePage', data)
    },

    // 删除页面
    deletePage(pageId) {
        return request.post('/space/deletePage', { page_id: pageId })
    },

    // 保存页面顺序
    savePageIds(pageIds) {
        return request.post('/space/savePageIds', { page_ids: pageIds })
    },

    // 生成页面链接
    addPageLink(pageId, pageType) {
        return request.post('/space/addPageLink', {
            page_id: pageId,
            page_type: pageType
        })
    },

    // 删除页面链接
    removePageLink(pageId) {
        return request.post('/space/removePageLink', { page_id: pageId })
    }
}
