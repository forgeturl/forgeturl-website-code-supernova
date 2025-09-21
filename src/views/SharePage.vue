<template>
  <div class="share-page-container">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <h1>ForgetURL</h1>
          <span class="page-type">{{ pageTypeText }}</span>
        </div>
        <div class="nav-right">
          <el-button type="text" @click="goHome">
            <el-icon><svg viewBox="0 0 24 24" width="1em" height="1em"><path fill="currentColor" d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg></el-icon>
            返回首页
          </el-button>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <div class="content-wrapper">
        <!-- 页面加载状态 -->
        <div v-if="loading" class="loading-state">
          <el-icon class="loading-icon" :size="48">
            <svg viewBox="0 0 24 24" width="1em" height="1em" class="loading-icon"><path fill="currentColor" d="M12 2V6a10 10 0 1 0 10 10h-4a6 6 0 1 1-6-6z"/></svg>
          </el-icon>
          <h3>正在加载页面...</h3>
        </div>

        <!-- 页面不存在 -->
        <div v-else-if="!page" class="not-found">
          <el-empty description="页面不存在或已过期" />
          <el-button type="primary" @click="goHome">
            返回首页
          </el-button>
        </div>

        <!-- 页面内容 -->
        <div v-else class="page-content">
          <!-- 页面标题和描述 -->
          <div class="page-info">
            <h1 class="page-title">{{ page.title }}</h1>
            <p class="page-brief">{{ page.brief }}</p>
          </div>

          <!-- 链接文件夹 -->
          <div class="collections-section">
            <div
              v-for="collection in page.collections"
              :key="collection.name"
              class="collection"
            >
              <h3 class="collection-title">{{ collection.name }}</h3>
              <div class="links-grid">
                <div
                  v-for="link in collection.links"
                  :key="link.url"
                  class="link-card"
                  @click="openLink(link.url)"
                >
                  <div class="link-content">
                    <h4 class="link-title">{{ link.title }}</h4>
                    <p class="link-url">{{ link.url }}</p>
                    <div v-if="link.tags && link.tags.length > 0" class="link-tags">
                      <el-tag
                        v-for="tag in link.tags"
                        :key="tag"
                        size="small"
                      >
                        {{ tag }}
                      </el-tag>
                    </div>
                  </div>
                  <div class="link-actions">
                    <el-button type="text" size="small" @click.stop="openLink(link.url)">
                      <el-icon><svg viewBox="0 0 24 24" width="1em" height="1em"><path fill="currentColor" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg></el-icon>
                      访问
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { pageAPI } from '../api/page'

const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(true)
const page = ref(null)
const shareType = ref('')
const shareId = ref('')

// 计算属性
const pageTypeText = computed(() => {
  const typeMap = {
    readonly: '只读模式',
    edit: '编辑模式',
    admin: '管理员模式'
  }
  return typeMap[shareType.value] || '分享模式'
})

// 生命周期
onMounted(async () => {
  shareType.value = route.params.type
  shareId.value = route.params.id

  if (shareType.value && shareId.value) {
    await loadSharedPage()
  } else {
    loading.value = false
  }
})

// 方法
const loadSharedPage = async () => {
  try {
    loading.value = true

    // 使用getPage接口获取分享页面数据
    const pageData = await pageAPI.getPage(shareId.value)

    if (pageData) {
      page.value = pageData
    } else {
      page.value = null
    }
  } catch (error) {
    console.error('加载分享页面失败:', error)
    page.value = null
    ElMessage.error('加载页面失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const openLink = (url) => {
  window.open(url, '_blank')
}

const goHome = () => {
  window.location.href = '/'
}
</script>

<style scoped>
.share-page-container {
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

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
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

.page-type {
  font-size: 14px;
  color: #666;
  background: #f0f0f0;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 500;
}

.main-content {
  padding: 24px;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.loading-state,
.not-found {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 60px 20px;
  text-align: center;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.loading-state h3 {
  margin: 0;
  color: #666;
  font-size: 18px;
}

.loading-icon {
  color: #667eea;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.page-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.page-info {
  padding: 24px;
  border-bottom: 1px solid #e4e7ed;
}

.page-title {
  margin: 0 0 12px 0;
  font-size: 28px;
  font-weight: 600;
  color: #333;
}

.page-brief {
  margin: 0;
  color: #666;
  font-size: 16px;
  line-height: 1.6;
}

.collections-section {
  padding: 24px;
}

.collection {
  margin-bottom: 32px;
}

.collection:last-child {
  margin-bottom: 0;
}

.collection-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.link-card {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.link-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

.link-content {
  margin-bottom: 12px;
}

.link-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.link-url {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 14px;
  word-break: break-all;
}

.link-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.link-actions {
  text-align: right;
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
  }

  .main-content {
    padding: 16px;
  }

  .logo {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .page-info {
    padding: 20px;
  }

  .page-title {
    font-size: 24px;
  }

  .collections-section {
    padding: 20px;
  }

  .links-grid {
    grid-template-columns: 1fr;
  }
}
</style>
