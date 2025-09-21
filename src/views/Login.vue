<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>ForgetURL</h2>
        <p class="subtitle">极简书签管理</p>
      </div>

      <div class="login-body">
        <div class="welcome-text">
          <p>欢迎使用 ForgetURL</p>
          <p>请选择登录方式开始管理您的书签</p>
        </div>

        <div class="login-buttons">
          <el-button
            type="primary"
            size="large"
            class="login-btn"
            @click="loginWithGoogle"
            :loading="loading.google"
          >
            <el-icon class="btn-icon"><svg viewBox="0 0 24 24" width="1em" height="1em"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg></el-icon>
            使用 Google 登录
          </el-button>

          <el-button
            type="primary"
            size="large"
            class="login-btn"
            @click="loginWithGithub"
            :loading="loading.github"
          >
            <el-icon class="btn-icon"><svg viewBox="0 0 24 24" width="1em" height="1em"><path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></el-icon>
            使用 GitHub 登录
          </el-button>

          <el-button
            type="success"
            size="large"
            class="login-btn"
            @click="loginWithWeixin"
            :loading="loading.weixin"
          >
            <el-icon class="btn-icon"><svg viewBox="0 0 24 24" width="1em" height="1em"><path fill="currentColor" d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 4.882-1.992 7.848-1.267l.028.007c4.8 0 8.691-3.342 8.691-7.396C26.999 5.476 23.108 2.188 18.308 2.188zm-1.38 5.69c.517 0 .938.42.938.938s-.42.938-.938.938-.938-.42-.938-.938.42-.938.938-.938zm5.09 0c.517 0 .938.42.938.938s-.42.938-.938.938-.938-.42-.938-.938.42-.938.938-.938z"/><path fill="currentColor" d="M26.822 18.785c0-2.212-1.17-4.203-3.002-5.55a.59.59 0 0 0-.213-.665l.39-1.48c.019-.07.048-.141.048-.213 0-.163-.13-.295-.29-.295a.326.326 0 0 1-.167.054l-1.903 1.114a.864.864 0 0 0-.717.098 10.16 10.16 0 0 1-2.837-.403c-.276 0-.543.027-.811.05.857 2.578-.157 4.972-1.932 6.446-1.703 1.415-4.882 1.992-7.848 1.267l-.028-.007c-4.8 0-8.691 3.342-8.691 7.396 0 4.054 3.891 7.342 8.691 7.342 4.8 0 8.691-3.288 8.691-7.342zM8.691 24.312c-.517 0-.938-.42-.938-.938s.42-.938.938-.938.938.42.938.938-.42.938-.938.938zm5.09 0c-.517 0-.938-.42-.938-.938s.42-.938.938-.938.938.42.938.938-.42.938-.938.938z"/></svg></el-icon>
            使用微信登录
          </el-button>
        </div>

        <div class="env-info">
          <p>当前环境: {{ currentEnv.toUpperCase() }}</p>
          <p>API地址: {{ apiUrl }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { ElMessage } from 'element-plus'
import { config, API_BASE_URL, CURRENT_ENV } from '../utils/config'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref({
  google: false,
  github: false,
  weixin: false
})

const currentEnv = ref(CURRENT_ENV)
const apiUrl = ref(API_BASE_URL)

// 检查是否已登录
onMounted(() => {
  if (authStore.isLoggedIn) {
    router.push('/home')
  }
})

// 第三方登录
const loginWithProvider = async (provider, loadingKey) => {
  loading.value[loadingKey] = true

  try {
    await authStore.loginWithProvider(provider)
    // 登录成功，跳转到回调页面处理
  } catch (error) {
    ElMessage.error(`登录失败: ${error.message}`)
    loading.value[loadingKey] = false
  }
}

const loginWithGoogle = () => {
  loginWithProvider('google', 'google')
}

const loginWithGithub = () => {
  loginWithProvider('github', 'github')
}

const loginWithWeixin = () => {
  loginWithProvider('weixin', 'weixin')
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-header h2 {
  margin: 0;
  font-size: 32px;
  font-weight: 600;
  color: #333;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  margin: 8px 0 0 0;
  color: #666;
  font-size: 16px;
}

.login-body {
  text-align: center;
}

.welcome-text {
  margin-bottom: 32px;
}

.welcome-text p {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 16px;
}

.welcome-text p:first-child {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.login-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.login-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.login-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.btn-icon {
  margin-right: 8px;
  font-size: 18px;
}

.env-info {
  padding-top: 20px;
  border-top: 1px solid #eee;
  color: #999;
  font-size: 12px;
}

.env-info p {
  margin: 4px 0;
}

@media (max-width: 480px) {
  .login-card {
    padding: 24px;
    margin: 16px;
  }

  .login-header h2 {
    font-size: 24px;
  }

  .login-btn {
    height: 44px;
    font-size: 15px;
  }
}
</style>
