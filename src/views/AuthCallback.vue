<template>
  <div class="callback-container">
    <div class="callback-card">
      <div class="callback-content">
        <el-icon class="loading-icon" :size="48">
          <Loading />
        </el-icon>
        <h3>正在处理登录...</h3>
        <p>请稍候，我们正在验证您的身份信息</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { ElMessage } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

onMounted(async () => {
  const provider = route.params.provider

  try {
    // 处理登录回调
    const userInfo = await authStore.handleAuthCallback(provider)

    ElMessage.success(`欢迎回来，${userInfo.display_name || userInfo.username}！`)

    // 跳转到首页
    router.push('/home')
  } catch (error) {
    console.error('登录回调失败:', error)
    ElMessage.error('登录失败，请重试')
    router.push('/login')
  }
})
</script>

<style scoped>
.callback-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.callback-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 60px 40px;
  text-align: center;
  min-width: 300px;
}

.callback-content h3 {
  margin: 24px 0 12px 0;
  font-size: 20px;
  color: #333;
}

.callback-content p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.loading-icon {
  color: #667eea;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
