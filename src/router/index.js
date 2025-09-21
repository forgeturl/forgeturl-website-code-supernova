import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import PageDetail from '../views/PageDetail.vue'

const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { title: '登录' }
    },
    {
        path: '/auth/callback/:provider',
        name: 'AuthCallback',
        component: () => import('../views/AuthCallback.vue'),
        meta: { title: '登录回调' }
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        meta: { title: '我的空间', requiresAuth: true }
    },
    {
        path: '/page/:id',
        name: 'PageDetail',
        component: PageDetail,
        meta: { title: '页面详情', requiresAuth: true }
    },
    {
        path: '/share/:type/:id',
        name: 'SharePage',
        component: () => import('../views/SharePage.vue'),
        meta: { title: '分享页面' }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
    // 设置页面标题
    if (to.meta.title) {
        document.title = `${to.meta.title} - ForgetURL`
    }

    // 检查是否需要登录
    if (to.meta.requiresAuth) {
        const token = localStorage.getItem('X-Token')
        if (!token) {
            next('/login')
            return
        }
    }

    next()
})

export default router
