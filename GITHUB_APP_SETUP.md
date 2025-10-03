# 🔗 Cloudflare GitHub App 完整设置指南

## 步骤 1：安装 GitHub App

1. 访问：https://github.com/apps/cloudflare-pages
2. 点击 `Install` 
3. 选择 `Only select repositories`
4. 勾选 `music-concert-app` 仓库
5. 点击 `Install`

## 步骤 2：在 Cloudflare 创建项目

1. 访问：https://dash.cloudflare.com
2. 点击 `Workers & Pages` → `Create application`
3. 选择 `Pages` → `Connect to Git`
4. 现在应该能看到您的 `music-concert-app` 仓库
5. 选择仓库并点击 `Begin setup`

## 步骤 3：配置部署设置

```
Project name: music-concert-app
Production branch: main
Framework preset: None
Build command: npm install && node _build-cloudflare.js
Build output directory: h5-dist
Root directory: (留空)
```

## 步骤 4：享受自动部署

安装完成后，每次您推送代码到 main 分支时：
- ✅ Cloudflare 会自动检测变更
- ✅ 自动构建和部署
- ✅ 在 GitHub PR 中显示部署状态
- ✅ 提供预览链接

## 仓库信息

- GitHub 仓库：https://github.com/YYW0228/music-concert-app
- 当前分支：main
- 构建脚本：已准备就绪