<template>
  <div class="page-detail-container">
    <!-- 顶部导航栏 -->
    <header class="header">
      <div class="header-content">
        <div class="nav-left">
          <el-button type="text" @click="goBack">
            <el-icon><ArrowLeft /></el-icon>
            返回
          </el-button>
          <div class="page-title-display">
            <h2>{{ page?.title }}</h2>
          </div>
        </div>
        <div class="nav-right">
          <el-button v-if="isEditMode" type="primary" @click="savePage" :loading="saving">
            <el-icon><Check /></el-icon>
            保存
          </el-button>
          <el-button v-if="canEdit" @click="toggleEditMode">
            <el-icon><Edit /></el-icon>
            {{ isEditMode ? '取消编辑' : '编辑页面' }}
          </el-button>
          <el-button v-if="isOwner" @click="showShareDialog = true">
            <el-icon><Share /></el-icon>
            分享设置
          </el-button>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <div class="content-wrapper">
        <!-- 页面基本信息 -->
        <div class="page-info">
          <div v-if="isEditMode" class="edit-form">
            <el-form :model="editForm" label-width="80px">
              <el-form-item label="页面标题">
                <el-input v-model="editForm.title" />
              </el-form-item>
              <el-form-item label="页面描述">
                <el-input
                  v-model="editForm.brief"
                  type="textarea"
                  :rows="3"
                />
              </el-form-item>
            </el-form>
          </div>
          <div v-else class="view-mode">
            <h1 class="page-title">{{ page?.title }}</h1>
            <p class="page-brief">{{ page?.brief }}</p>
          </div>
        </div>

        <!-- 链接文件夹 -->
        <div class="collections-section">
          <div v-if="isEditMode" class="edit-collections">
            <div
              v-for="(collection, index) in editForm.collections"
              :key="index"
              class="collection-editor"
            >
              <div class="collection-header">
                <el-input
                  v-model="collection.name"
                  placeholder="文件夹名称"
                  style="flex: 1; margin-right: 12px;"
                />
                <el-button type="danger" size="small" @click="removeCollection(index)">
                  <el-icon><Delete /></el-icon>
                  删除文件夹
                </el-button>
              </div>

              <div class="links-editor">
                <div
                  v-for="(link, linkIndex) in collection.links"
                  :key="linkIndex"
                  class="link-item"
                >
                  <el-input
                    v-model="link.title"
                    placeholder="链接标题"
                    style="flex: 1; margin-right: 8px;"
                  />
                  <el-input
                    v-model="link.url"
                    placeholder="链接地址"
                    style="flex: 2; margin-right: 8px;"
                  />
                  <el-button type="danger" size="small" @click="removeLink(collection, linkIndex)">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
                <el-button type="text" @click="addLink(collection)">
                  <el-icon><Plus /></el-icon>
                  添加链接
                </el-button>
              </div>
            </div>

            <el-button type="primary" @click="addCollection">
              <el-icon><Plus /></el-icon>
              添加文件夹
            </el-button>
          </div>

          <div v-else class="view-collections">
            <div
              v-for="collection in page?.collections"
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
                      <el-icon><Link /></el-icon>
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

    <!-- 分享设置对话框 -->
    <el-dialog
      v-model="showShareDialog"
      title="分享设置"
      width="600px"
    >
      <div class="share-dialog">
        <div class="share-item">
          <div class="share-info">
            <h4>只读链接</h4>
            <p>其他人可以查看页面内容，但不能编辑</p>
          </div>
          <div class="share-actions">
            <el-button
              v-if="!page?.readonly_page_id"
              type="primary"
              @click="generateShareLink('readonly')"
              :loading="generatingLink === 'readonly'"
            >
              生成只读链接
            </el-button>
            <div v-else class="share-link">
              <el-input :value="getShareUrl('readonly')" readonly />
              <el-button type="primary" @click="copyShareUrl('readonly')">
                复制链接
              </el-button>
            </div>
          </div>
        </div>

        <div class="share-item">
          <div class="share-info">
            <h4>编辑链接</h4>
            <p>其他人可以查看和编辑页面内容</p>
          </div>
          <div class="share-actions">
            <el-button
              v-if="!page?.edit_page_id"
              type="primary"
              @click="generateShareLink('edit')"
              :loading="generatingLink === 'edit'"
            >
              生成编辑链接
            </el-button>
            <div v-else class="share-link">
              <el-input :value="getShareUrl('edit')" readonly />
              <el-button type="primary" @click="copyShareUrl('edit')">
                复制链接
              </el-button>
            </div>
          </div>
        </div>

        <div class="share-item">
          <div class="share-info">
            <h4>超级权限链接</h4>
            <p>其他人拥有页面的所有权限，包括删除页面</p>
          </div>
          <div class="share-actions">
            <el-button
              v-if="!page?.admin_page_id"
              type="primary"
              @click="generateShareLink('admin')"
              :loading="generatingLink === 'admin'"
            >
              生成超级权限链接
            </el-button>
            <div v-else class="share-link">
              <el-input :value="getShareUrl('admin')" readonly />
              <el-button type="primary" @click="copyShareUrl('admin')">
                复制链接
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <el-button @click="showShareDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePageStore } from '../stores/page'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const pageStore = usePageStore()

// 响应式数据
const pageId = ref('')
const isEditMode = ref(false)
const saving = ref(false)
const showShareDialog = ref(false)
const generatingLink = ref('')

// 编辑表单
const editForm = ref({
  title: '',
  brief: '',
  collections: []
})

// 计算属性
const page = computed(() => pageStore.currentPage)
const canEdit = computed(() => page.value?.can_edit || page.value?.is_self)
const isOwner = computed(() => page.value?.is_self)

// 监听路由参数
watch(() => route.params.id, async (newId) => {
  if (newId) {
    pageId.value = newId
    await loadPage()
  }
}, { immediate: true })

// 生命周期
onMounted(async () => {
  const edit = route.query.edit === 'true'
  isEditMode.value = edit && canEdit.value

  if (pageId.value) {
    await loadPage()
  }
})

// 方法
const loadPage = async () => {
  try {
    await pageStore.getPage(pageId.value)
    if (page.value) {
      // 初始化编辑表单
      editForm.value = {
        title: page.value.title,
        brief: page.value.brief,
        collections: JSON.parse(JSON.stringify(page.value.collections || []))
      }
    }
  } catch (error) {
    ElMessage.error('加载页面失败')
    console.error('加载页面失败:', error)
  }
}

const goBack = () => {
  router.push('/home')
}

const toggleEditMode = () => {
  if (isEditMode.value) {
    // 退出编辑模式，恢复原始数据
    editForm.value = {
      title: page.value?.title || '',
      brief: page.value?.brief || '',
      collections: JSON.parse(JSON.stringify(page.value?.collections || []))
    }
  }
  isEditMode.value = !isEditMode.value
}

const savePage = async () => {
  try {
    saving.value = true

    await pageStore.updatePage({
      page_id: pageId.value,
      title: editForm.value.title,
      brief: editForm.value.brief,
      collections: editForm.value.collections,
      version: page.value?.version || 0,
      mask: 0x07 // 更新所有字段
    })

    ElMessage.success('页面保存成功')
    isEditMode.value = false
  } catch (error) {
    ElMessage.error('保存页面失败')
    console.error('保存页面失败:', error)
  } finally {
    saving.value = false
  }
}

const addCollection = () => {
  editForm.value.collections.push({
    name: '',
    links: []
  })
}

const removeCollection = (index) => {
  editForm.value.collections.splice(index, 1)
}

const addLink = (collection) => {
  collection.links.push({
    title: '',
    url: '',
    tags: []
  })
}

const removeLink = (collection, index) => {
  collection.links.splice(index, 1)
}

const openLink = (url) => {
  window.open(url, '_blank')
}

const generateShareLink = async (type) => {
  try {
    generatingLink.value = type

    const pageTypeMap = {
      readonly: '只读',
      edit: '编辑',
      admin: '超级权限'
    }

    await pageStore.addPageLink(pageId.value, pageTypeMap[type])
    ElMessage.success(`${pageTypeMap[type]}链接生成成功`)
  } catch (error) {
    ElMessage.error('生成链接失败')
    console.error('生成链接失败:', error)
  } finally {
    generatingLink.value = ''
  }
}

const getShareUrl = (type) => {
  const baseUrl = window.location.origin
  const pageIdMap = {
    readonly: page.value?.readonly_page_id,
    edit: page.value?.edit_page_id,
    admin: page.value?.admin_page_id
  }

  const linkId = pageIdMap[type]
  if (!linkId) return ''

  return `${baseUrl}/share/${type}/${linkId}`
}

const copyShareUrl = async (type) => {
  try {
    const url = getShareUrl(type)
    if (url) {
      await navigator.clipboard.writeText(url)
      ElMessage.success('链接已复制到剪贴板')
    } else {
      ElMessage.error('链接不存在')
    }
  } catch (error) {
    ElMessage.error('复制链接失败')
    console.error('复制链接失败:', error)
  }
}
</script>

<style scoped>
.page-detail-container {
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

.nav-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.page-title-display h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.nav-right {
  display: flex;
  gap: 12px;
}

.main-content {
  padding: 24px;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.page-info {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

.edit-form {
  max-width: 600px;
}

.view-mode .page-title {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.view-mode .page-brief {
  color: #666;
  font-size: 16px;
  line-height: 1.6;
}

.collections-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.collection-editor {
  margin-bottom: 24px;
  padding: 16px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
}

.collection-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.links-editor {
  margin-left: 20px;
}

.link-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.view-collections .collection {
  margin-bottom: 32px;
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

.share-dialog {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.share-item {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.share-info {
  flex: 1;
}

.share-info h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.share-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.share-actions {
  flex: 2;
}

.share-link {
  display: flex;
  gap: 8px;
}

.share-link .el-input {
  flex: 1;
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 16px;
    flex-direction: column;
    height: auto;
    padding: 16px;
    gap: 16px;
  }

  .nav-left {
    flex-direction: column;
    gap: 12px;
    width: 100%;
  }

  .nav-right {
    width: 100%;
    justify-content: center;
  }

  .main-content {
    padding: 16px;
  }

  .share-item {
    flex-direction: column;
    gap: 12px;
  }

  .links-grid {
    grid-template-columns: 1fr;
  }
}
</style>
