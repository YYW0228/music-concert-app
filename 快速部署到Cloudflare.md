# 🚀 快速部署到 Cloudflare Pages

## ✅ 已完成的修复

我已经为您完成了以下关键修复：

1. **修复了 webview.js 的硬编码URL问题** - 现在使用占位符，部署脚本可以正确替换
2. **统一了配置文件** - `miniprogram-config.js` 中所有域名配置现在一致
3. **创建了专用的构建脚本** - `_build-cloudflare.js` 专门为 Cloudflare Pages 设计
4. **添加了 H5 构建脚本** - `scripts/deploy-h5.js` 用于本地测试
5. **创建了一键配置工具** - `scripts/cloudflare-setup.js` 简化配置过程

## 📋 您需要执行的步骤

### 1. 推送代码到 GitHub
```bash
cd /Users/mac/Downloads/yinyuehui
git add .
git commit -m "添加Cloudflare部署配置"
git push
```

### 2. 在 Cloudflare 创建 Pages 项目

1. 访问 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 `Workers & Pages` → `Create application` → `Pages` → `Connect to Git`
3. 选择您的 `yinyuehui` 仓库
4. 配置构建设置：
   ```
   Project name: yinyuehui
   Production branch: main
   Framework preset: None
   Build command: node _build-cloudflare.js
   Build output directory: h5-dist
   ```
5. 点击 `Save and Deploy`

### 3. 获取您的 Cloudflare 域名
- 等待部署完成（约2-5分钟）
- 复制生成的域名，例如：`https://yinyuehui.pages.dev`

### 4. 配置微信小程序业务域名
1. 登录 [微信公众平台](https://mp.weixin.qq.com)
2. 进入 `开发管理` → `开发设置` → `业务域名`
3. 添加您的 Cloudflare 域名（不带 https://）
4. 下载微信提供的校验文件

### 5. 添加校验文件并重新部署
```bash
# 将下载的校验文件复制到项目根目录
cp ~/Downloads/WW_verify_*.txt ./
git add .
git commit -m "添加微信业务域名校验文件"
git push
```

### 6. 一键配置小程序
```bash
npm run cloudflare:setup
```
这个命令会：
- 引导您输入 Cloudflare 域名
- 自动更新配置文件
- 生成最终的小程序包

### 7. 上传小程序
1. 打开微信开发者工具
2. 导入项目：选择 `dist` 目录
3. 预览测试：扫码确认页面正常加载
4. 上传发布：提交审核

## 🎯 关键优势

通过这个解决方案，您获得了：

- ✅ **完全免费** - Cloudflare Pages 免费托管
- ✅ **自动部署** - 代码推送自动触发构建
- ✅ **HTTPS 域名** - 免费的 .pages.dev 域名
- ✅ **全球CDN** - Cloudflare 的全球加速
- ✅ **零运维** - 无需管理服务器

## 🔧 如果遇到问题

1. **构建失败**：检查 Cloudflare 构建日志
2. **域名验证失败**：确保校验文件正确上传
3. **小程序白屏**：检查开发者工具网络日志

## 📞 下一步

执行完上述步骤后，您的小程序就能正常工作了！如果需要帮助，请告诉我具体在哪一步遇到了问题。