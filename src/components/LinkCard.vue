<template>
  <div
    class="link-card"
    :class="{ 'link-card--disabled': disabled }"
    @click="handleClick"
  >
    <div class="link-header">
      <div class="link-icon">
        <el-icon v-if="faviconError" class="default-icon">
          <Link />
        </el-icon>
        <img
          v-else
          :src="link.favicon || getFavicon(link.url)"
          :alt="link.title"
          @error="handleFaviconError"
          class="favicon"
        />
      </div>
      <div class="link-info">
        <h4 class="link-title">{{ link.title }}</h4>
        <p class="link-url">{{ formatUrl(link.url) }}</p>
      </div>
    </div>

    <div v-if="link.description" class="link-description">
      {{ link.description }}
    </div>

    <div v-if="link.tags && link.tags.length > 0" class="link-tags">
      <el-tag
        v-for="tag in link.tags.slice(0, 3)"
        :key="tag"
        size="small"
        :type="getTagType(tag)"
      >
        {{ tag }}
      </el-tag>
      <el-tag v-if="link.tags.length > 3" size="small" type="info">
        +{{ link.tags.length - 3 }}
      </el-tag>
    </div>

    <div class="link-actions" @click.stop>
      <el-button
        type="text"
        size="small"
        @click="openLink"
        :disabled="disabled"
      >
        <el-icon><svg viewBox="0 0 24 24" width="1em" height="1em"><path fill="currentColor" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg></el-icon>
        访问
      </el-button>
      <el-button
        v-if="showEdit"
        type="text"
        size="small"
        @click="editLink"
        :disabled="disabled"
      >
        <el-icon><svg viewBox="0 0 24 24" width="1em" height="1em"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></el-icon>
        编辑
      </el-button>
      <el-button
        v-if="showDelete"
        type="text"
        size="small"
        @click="deleteLink"
        :disabled="disabled"
        style="color: #f56c6c;"
      >
        <el-icon><svg viewBox="0 0 24 24" width="1em" height="1em"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg></el-icon>
        删除
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { formatUrl } from '../utils/string'

const props = defineProps({
  link: {
    type: Object,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false
  },
  showEdit: {
    type: Boolean,
    default: true
  },
  showDelete: {
    type: Boolean,
    default: false
  },
  compact: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click', 'edit', 'delete'])

const faviconError = ref(false)

// 计算属性
const linkClasses = computed(() => {
  return {
    'link-card--compact': props.compact
  }
})

// 方法
const getFavicon = (url) => {
  try {
    const urlObj = new URL(url)
    return `${urlObj.protocol}//${urlObj.hostname}/favicon.ico`
  } catch {
    return ''
  }
}

const handleFaviconError = () => {
  faviconError.value = true
}

const handleClick = () => {
  if (!props.disabled) {
    emit('click', props.link)
  }
}

const openLink = () => {
  if (!props.disabled && props.link.url) {
    window.open(props.link.url, '_blank')
  }
}

const editLink = () => {
  emit('edit', props.link)
}

const deleteLink = () => {
  emit('delete', props.link)
}

const getTagType = (tag) => {
  // 根据标签内容返回不同的颜色类型
  const tagTypes = {
    重要: 'danger',
    工作: 'warning',
    学习: 'success',
    娱乐: 'primary',
    工具: 'info'
  }

  const lowerTag = tag.toLowerCase()
  for (const [key, type] of Object.entries(tagTypes)) {
    if (lowerTag.includes(key.toLowerCase())) {
      return type
    }
  }

  return 'info'
}
</script>

<style scoped>
.link-card {
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.link-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  transform: translateY(-2px);
}

.link-card--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.link-card--compact {
  padding: 12px;
}

.link-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.link-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.link-card--compact .link-icon {
  width: 24px;
  height: 24px;
}

.favicon {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-icon {
  color: #909399;
  font-size: 16px;
}

.link-card--compact .default-icon {
  font-size: 12px;
}

.link-info {
  flex: 1;
  min-width: 0;
}

.link-title {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.link-card--compact .link-title {
  font-size: 14px;
}

.link-url {
  margin: 0;
  font-size: 12px;
  color: #909399;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.link-description {
  margin-bottom: 12px;
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.link-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 12px;
}

.link-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.link-actions .el-button {
  font-size: 12px;
}
</style>
