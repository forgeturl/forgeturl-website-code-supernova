# ForgetURL 前端项目

极简书签管理网站的前端实现，基于 Vue 3 + Element Plus 构建。

## 功能特性

- 🔐 **第三方登录**：支持 Google、GitHub、微信登录
- 📖 **书签管理**：创建、编辑、删除书签页面
- 🔗 **权限管理**：支持只读、编辑、超级权限链接分享
- 🌍 **多环境支持**：local、test、onl 环境自动切换
- 💾 **本地存储**：登录状态和偏好设置本地持久化
- 📱 **响应式设计**：支持桌面端和移动端

## 技术栈

- **Vue 3** - 渐进式JavaScript框架
- **Vue Router 4** - 官方路由管理器
- **Pinia** - 新一代状态管理
- **Element Plus** - Vue 3 企业级UI组件库
- **Vite** - 快速的构建工具
- **Axios** - HTTP客户端
- **Day.js** - 轻量级日期处理库

## 项目结构

```
src/
├── api/           # API接口
│   ├── auth.js    # 认证相关接口
│   └── page.js    # 页面相关接口
├── components/    # 公共组件
│   └── LinkCard.vue # 链接卡片组件
├── router/        # 路由配置
│   └── index.js   # 主路由
├── stores/        # 状态管理
│   ├── auth.js    # 认证状态
│   └── page.js    # 页面状态
├── utils/         # 工具函数
│   ├── config.js  # 环境配置
│   ├── request.js # HTTP请求封装
│   ├── storage.js # 本地存储封装
│   ├── date.js    # 日期处理
│   └── string.js  # 字符串处理
├── views/         # 页面组件
│   ├── Login.vue         # 登录页面
│   ├── AuthCallback.vue  # 登录回调
│   ├── Home.vue          # 首页（我的空间）
│   ├── PageDetail.vue    # 页面详情
│   └── SharePage.vue     # 分享页面
├── App.vue        # 根组件
└── main.js        # 应用入口
```

## 环境配置

项目支持三个环境，自动根据域名切换：

- **本地环境** (`localhost:3000`) → API: `http://127.0.0.1:80`
- **测试环境** (`test.forgeturl.com`) → API: `https://test-api.brightguo.com`
- **生产环境** (`forgeturl.com`) → API: `https://api.brightguo.com`

## 安装和运行

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

访问 `http://localhost:3000`

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 开发指南

### 登录流程

1. 用户点击第三方登录按钮
2. 前端调用 `/login/connector/auth/{provider}` 获取授权URL
3. 跳转到授权URL进行第三方认证
4. 认证成功后回调到 `/auth/callback/{provider}`
5. 前端调用 `/login/connector/callback/{provider}` 获取用户信息
6. 保存用户信息和token到本地存储

### 权限说明

- **只读链接**：可以查看页面内容，不能编辑
- **编辑链接**：可以查看和编辑页面内容，不能删除
- **超级权限链接**：拥有页面的所有权限，包括删除

### 本地存储

项目使用封装的本地存储工具，支持：

- 用户信息持久化
- 登录token保存
- 偏好设置存储
- 最近访问页面记录

## API 接口

### 认证相关

- `GET /login/connector/auth/{provider}` - 获取第三方登录URL
- `GET /login/connector/callback/{provider}` - 第三方登录回调
- `POST /login/logout` - 登出

### 页面相关

- `POST /space/getMySpace` - 获取我的空间
- `POST /space/createPage` - 创建页面
- `POST /space/getPage` - 获取页面详情
- `POST /space/updatePage` - 更新页面
- `POST /space/deletePage` - 删除页面
- `POST /space/savePageIds` - 保存页面顺序
- `POST /space/addPageLink` - 生成页面链接
- `POST /space/removePageLink` - 删除页面链接

## 部署说明

1. 构建项目：`npm run build`
2. 将 `dist` 目录部署到Web服务器
3. 配置Web服务器支持HTML5 History模式
4. 设置正确的环境变量和API地址

## 注意事项

- 项目使用 `X-Token` 请求头进行身份认证
- 所有API请求都需要携带有效的token
- 登录状态会在浏览器关闭后自动恢复
- 支持跨域请求，生产环境需要正确配置CORS

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证

MIT License