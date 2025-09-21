import { defineStore } from 'pinia'
import { pageAPI } from '../api/page'

export const usePageStore = defineStore('page', {
    state: () => ({
        space: null,
        currentPage: null,
        pages: []
    }),

    getters: {
        mySpace: (state) => state.space,
        pageList: (state) => state.pages,
        currentPageData: (state) => state.currentPage
    },

    actions: {
        // 获取我的空间
        async getMySpace() {
            try {
                const space = await pageAPI.getMySpace()
                this.space = space
                this.pages = space.page_briefs || []
                return space
            } catch (error) {
                console.error('获取空间失败:', error)
                throw error
            }
        },

        // 创建页面
        async createPage(data) {
            try {
                const result = await pageAPI.createPage(data)
                if (result.page_id) {
                    // 刷新空间数据
                    await this.getMySpace()
                }
                return result
            } catch (error) {
                console.error('创建页面失败:', error)
                throw error
            }
        },

        // 获取页面详情
        async getPage(pageId) {
            try {
                const page = await pageAPI.getPage(pageId)
                this.currentPage = page
                return page
            } catch (error) {
                console.error('获取页面失败:', error)
                throw error
            }
        },

        // 更新页面
        async updatePage(data) {
            try {
                const result = await pageAPI.updatePage(data)
                // 更新当前页面数据
                if (this.currentPage && this.currentPage.page_id === data.page_id) {
                    this.currentPage = { ...this.currentPage, ...result }
                }
                // 刷新空间数据
                await this.getMySpace()
                return result
            } catch (error) {
                console.error('更新页面失败:', error)
                throw error
            }
        },

        // 删除页面
        async deletePage(pageId) {
            try {
                await pageAPI.deletePage(pageId)
                // 从列表中移除
                const index = this.pages.findIndex(p => p.page_id === pageId)
                if (index > -1) {
                    this.pages.splice(index, 1)
                }
                // 如果删除的是当前页面，清空当前页面
                if (this.currentPage && this.currentPage.page_id === pageId) {
                    this.currentPage = null
                }
            } catch (error) {
                console.error('删除页面失败:', error)
                throw error
            }
        },

        // 保存页面顺序
        async savePageIds(pageIds) {
            try {
                const result = await pageAPI.savePageIds(pageIds)
                this.pages = this.pages.map(page => {
                    const newIndex = result.page_ids.indexOf(page.page_id)
                    return { ...page, order: newIndex }
                }).sort((a, b) => (a.order || 0) - (b.order || 0))
                return result
            } catch (error) {
                console.error('保存页面顺序失败:', error)
                throw error
            }
        },

        // 生成页面链接
        async addPageLink(pageId, pageType) {
            try {
                const result = await pageAPI.addPageLink(pageId, pageType)
                // 更新当前页面的链接信息
                if (this.currentPage && this.currentPage.page_id === pageId) {
                    this.currentPage = {
                        ...this.currentPage,
                        readonly_page_id: result.readonly_page_id || this.currentPage.readonly_page_id,
                        edit_page_id: result.edit_page_id || this.currentPage.edit_page_id,
                        admin_page_id: result.admin_page_id || this.currentPage.admin_page_id
                    }
                }
                return result
            } catch (error) {
                console.error('生成页面链接失败:', error)
                throw error
            }
        },

        // 删除页面链接
        async removePageLink(pageId) {
            try {
                await pageAPI.removePageLink(pageId)
                // 清除当前页面的链接信息
                if (this.currentPage && this.currentPage.page_id === pageId) {
                    this.currentPage = {
                        ...this.currentPage,
                        readonly_page_id: null,
                        edit_page_id: null,
                        admin_page_id: null
                    }
                }
            } catch (error) {
                console.error('删除页面链接失败:', error)
                throw error
            }
        }
    }
})
