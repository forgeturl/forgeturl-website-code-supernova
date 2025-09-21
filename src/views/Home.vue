<template>
  <div class="home-container">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <h1>ForgetURL</h1>
        </div>
        <div class="user-info">
          <el-dropdown @command="handleCommand">
            <span class="user-name">
              {{ userInfo?.display_name || userInfo?.username }}
              <el-icon><svg viewBox="0 0 24 24" width="1em" height="1em"><path fill="currentColor" d="M7 10l5 5 5-5z"/></svg></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人资料</el-dropdown-item>
                <el-dropdown-item command="settings">设置</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <div class="content-wrapper">
        <!-- 工具栏 -->
        <div class="toolbar">
          <el-button type="primary" @click="showCreateDialog = true">
            <el-icon><svg viewBox="0 0 24 24" width="1em" height="1em"><path fill="currentColor" d="M19 11h-6V5a2 2 0 0 0-4 0v6H3a2 2 0 0 0 0 4h6v6a2 2 0 0 0 4 0v-6h6a2 2 0 0 0 0-4z"/></svg></el-icon>
            新建页面
          </el-button>
          <div class="search-box">
            <el-input
              v-model="searchText"
              placeholder="搜索页面..."
              :prefix-icon="SearchIcon"
              clearable
              @input="handleSearch"
            />
          </div>
        </div>

        <!-- 页面列表 -->
        <div class="pages-container">
          <div
            v-if="filteredPages.length === 0"
            class="empty-state"
          >
            <el-empty description="还没有页面，快来创建第一个页面吧！" />
          </div>

          <div v-else class="pages-grid">
            <div
              v-for="page in filteredPages"
              :key="page.page_id"
              class="page-card"
              @click="openPage(page)"
            >
              <div class="page-header">
                <h3 class="page-title">{{ page.title }}</h3>
                <div class="page-actions">
                  <el-button
                    type="text"
                    size="small"
                    @click.stop="editPage(page)"
                  >
                    <el-icon><svg viewBox="0 0 24 24" width="1em" height="1em"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></el-icon>
                  </el-button>
                  <el-button
                    type="text"
                    size="small"
                    @click.stop="deletePage(page)"
                    style="color: #f56c6c;"
                  >
                    <el-icon><svg viewBox="0 0 24 24" width="1em" height="1em"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg></el-icon>
                  </el-button>
                </div>
              </div>

              <p class="page-description">{{ page.brief }}</p>

              <div class="page-footer">
                <div class="page-meta">
                  <span class="meta-item">
                    <el-icon><svg viewBox="0 0 24 24" width="1em" height="1em"><path fill="currentColor" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg></el-icon>
                    {{ formatDate(page.create_time) }}
                  </span>
                  <span v-if="page.is_self" class="meta-item owner">
                    <el-icon><svg viewBox="0 0 24 24" width="1em" height="1em"><path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg></el-icon>
                    我的
                  </span>
                </div>

                <div class="page-links">
                  <el-button
                    v-if="page.readonly_page_id"
                    type="text"
                    size="small"
                    @click.stop="copyShareLink(page.readonly_page_id, '只读')"
                  >
                    只读链接
                  </el-button>
                  <el-button
                    v-if="page.edit_page_id"
                    type="text"
                    size="small"
                    @click.stop="copyShareLink(page.edit_page_id, '编辑')"
                  >
                    编辑链接
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 创建页面对话框 -->
    <el-dialog
      v-model="showCreateDialog"
      title="新建页面"
      width="500px"
    >
      <el-form :model="createForm" :rules="createRules" ref="createFormRef">
        <el-form-item label="页面标题" prop="title">
          <el-input v-model="createForm.title" placeholder="请输入页面标题" />
        </el-form-item>
        <el-form-item label="页面描述" prop="brief">
          <el-input
            v-model="createForm.brief"
            type="textarea"
            :rows="3"
            placeholder="请输入页面描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="handleCreatePage" :loading="creating">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { usePageStore } from '../stores/page'
import { ElMessage, ElMessageBox } from 'element-plus'
import dayjs from 'dayjs'

const router = useRouter()
const authStore = useAuthStore()
const pageStore = usePageStore()

// 搜索图标组件
const SearchIcon = () => h('svg', {
  viewBox: '0 0 24 24',
  width: '1em',
  height: '1em'
}, h('path', {
  fill: 'currentColor',
  d: 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'
}))

// 响应式数据
const searchText = ref('')
const showCreateDialog = ref(false)
const creating = ref(false)
const createFormRef = ref()

// 表单数据
const createForm = ref({
  title: '',
  brief: ''
})

// 表单验证规则
const createRules = {
  title: [
    { required: true, message: '请输入页面标题', trigger: 'blur' },
    { min: 1, max: 100, message: '标题长度在1-100字符', trigger: 'blur' }
  ],
  brief: [
    { required: true, message: '请输入页面描述', trigger: 'blur' },
    { min: 1, max: 500, message: '描述长度在1-500字符', trigger: 'blur' }
  ]
}

// 计算属性
const userInfo = computed(() => authStore.user)
const filteredPages = computed(() => {
  if (!searchText.value) return pageStore.pages
  return pageStore.pages.filter(page =>
    page.title.toLowerCase().includes(searchText.value.toLowerCase()) ||
    page.brief.toLowerCase().includes(searchText.value.toLowerCase())
  )
})

// 生命周期
onMounted(async () => {
  try {
    await pageStore.getMySpace()
  } catch (error) {
    ElMessage.error('加载页面失败')
    console.error('获取空间失败:', error)
  }
})

// 方法
const handleCommand = (command) => {
  switch (command) {
    case 'logout':
      handleLogout()
      break
    case 'profile':
      ElMessage.info('个人资料功能开发中')
      break
    case 'settings':
      ElMessage.info('设置功能开发中')
      break
  }
}

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await authStore.logout()
    ElMessage.success('已退出登录')
    router.push('/login')
  } catch {
    // 用户取消操作
  }
}

const handleSearch = () => {
  // 搜索功能已在计算属性中实现
}

const handleCreatePage = async () => {
  if (!createFormRef.value) return

  try {
    await createFormRef.value.validate()

    creating.value = true
    await pageStore.createPage(createForm.value)

    ElMessage.success('页面创建成功')
    showCreateDialog.value = false

    // 重置表单
    createForm.value = {
      title: '',
      brief: ''
    }
  } catch (error) {
    if (error !== 'validation failed') {
      ElMessage.error('创建页面失败')
      console.error('创建页面失败:', error)
    }
  } finally {
    creating.value = false
  }
}

const openPage = (page) => {
  router.push(`/page/${page.page_id}`)
}

const editPage = (page) => {
  router.push(`/page/${page.page_id}?edit=true`)
}

const deletePage = async (page) => {
  try {
    await ElMessageBox.confirm(`确定要删除页面"${page.title}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    await pageStore.deletePage(page.page_id)
    ElMessage.success('页面删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除页面失败')
      console.error('删除页面失败:', error)
    }
  }
}

const copyShareLink = async (pageId, type) => {
  try {
    const shareUrl = `${window.location.origin}/share/readonly/${pageId}`
    await navigator.clipboard.writeText(shareUrl)
    ElMessage.success(`${type}链接已复制到剪贴板`)
  } catch (error) {
    ElMessage.error('复制链接失败')
    console.error('复制链接失败:', error)
  }
}

const formatDate = (timestamp) => {
  return dayjs(timestamp * 1000).format('YYYY-MM-DD HH:mm')
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.header {
  background: white;
  border-bottom: 1px solid #e4e7ed;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-name {
  cursor: pointer;
  font-size: 16px;
  color: #333;
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.user-name:hover {
  background-color: #f5f5f5;
}

.main-content {
  padding: 24px;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.toolbar {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-box {
  flex: 1;
  max-width: 300px;
  margin-left: auto;
}

.pages-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-height: 400px;
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
}

.pages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}

.page-card {
  background: #fafafa;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.page-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  transform: translateY(-2px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.page-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  flex: 1;
  margin-right: 12px;
}

.page-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.page-card:hover .page-actions {
  opacity: 1;
}

.page-description {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.page-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #999;
}

.page-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-item.owner {
  color: #667eea;
}

.page-links {
  display: flex;
  gap: 8px;
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
  }

  .main-content {
    padding: 16px;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    margin-left: 0;
    max-width: none;
  }

  .pages-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px;
  }

  .page-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
