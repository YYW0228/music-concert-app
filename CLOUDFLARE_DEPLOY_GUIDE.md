# Cloudflare Pages 部署指南

## 🎯 目标
将音乐会小程序的 H5 页面部署到 Cloudflare Pages，获得免费的 HTTPS 域名，然后配置小程序使用这个域名。

## 📋 完整部署流程

### 第一步：在 Cloudflare 创建 Pages 项目

1. **登录 Cloudflare 控制台**
   - 访问 [https://dash.cloudflare.com](https://dash.cloudflare.com)
   - 登录您的账户

2. **创建 Pages 项目**
   - 点击左侧菜单 `Workers & Pages`
   - 点击 `Create application`
   - 选择 `Pages` 标签
   - 点击 `Connect to Git`

3. **连接 GitHub 仓库**
   - 选择您的 GitHub 账户
   - 找到并选择 `yinyuehui` 仓库
   - 点击 `Begin setup`

4. **配置构建设置**
   ```
   Project name: yinyuehui (或您喜欢的名字)
   Production branch: main
   Framework preset: None
   Build command: node _build-cloudflare.js
   Build output directory: h5-dist
   Root directory: (留空)
   ```

5. **环境变量**
   - 不需要设置任何环境变量
   - 直接点击 `Save and Deploy`

### 第二步：等待首次部署完成

1. **监控部署过程**
   - Cloudflare 会自动开始构建
   - 第一次部署大约需要 2-5 分钟
   - 您可以在 `Deployments` 标签查看实时日志

2. **获取您的域名**
   - 部署成功后，Cloudflare 会显示您的域名
   - 格式类似：`https://yinyuehui.pages.dev`
   - **请复制这个完整的域名，包括 https://**

### 第三步：配置微信小程序业务域名

1. **登录微信公众平台**
   - 访问 [https://mp.weixin.qq.com](https://mp.weixin.qq.com)
   - 使用小程序管理员账号登录

2. **添加业务域名**
   - 进入 `开发管理` → `开发设置` → `业务域名`
   - 点击 `添加`
   - 输入您的 Cloudflare 域名（不带 https://）
   - 例如：`yinyuehui.pages.dev`

3. **下载校验文件**
   - 微信会提供一个校验文件下载
   - 文件名类似：`WW_verify_xxxxxxxxxx.txt`
   - 下载这个文件

### 第四步：添加微信校验文件到项目

1. **将校验文件放到项目根目录**
   ```bash
   # 将下载的校验文件复制到项目根目录
   cp ~/Downloads/WW_verify_xxxxxxxxxx.txt ./
   ```

2. **提交代码**
   ```bash
   git add .
   git commit -m "添加微信业务域名校验文件"
   git push
   ```

3. **等待自动重新部署**
   - Cloudflare 检测到代码变化，会自动重新部署
   - 部署完成后，校验文件就能被微信访问到了

4. **在微信后台完成验证**
   - 回到微信公众平台的业务域名设置页面
   - 点击 `保存` 完成域名验证

### 第五步：更新小程序配置

1. **修改配置文件**
   - 打开 `deploy/miniprogram-config.js`
   - 将 `webDomain` 改为您的 Cloudflare 域名：
   ```javascript
   webDomain: 'https://yinyuehui.pages.dev', // 替换为您的实际域名
   ```

2. **更新业务域名列表**
   - 同时更新 `webviewDomains` 数组：
   ```javascript
   webviewDomains: [
     'https://yinyuehui.pages.dev' // 替换为您的实际域名
   ],
   ```

### 第六步：生成最终小程序包

1. **运行构建命令**
   ```bash
   npm run deploy:miniprogram
   ```

2. **检查生成的文件**
   - 确认 `dist/pages/webview/webview.js` 中的 URL 已更新
   - 应该包含您的 Cloudflare 域名

### 第七步：上传小程序

1. **打开微信开发者工具**
   - 导入项目：选择 `dist` 目录
   - 项目名称：营地主题音乐会
   - AppID：wx63d06a67fb222cb8

2. **预览测试**
   - 点击 `预览`
   - 用手机扫码测试
   - 确认 H5 页面能正常加载

3. **上传发布**
   - 点击 `上传`
   - 填写版本号和描述
   - 提交审核

## 🔧 故障排除

### 常见问题

1. **构建失败**
   ```
   Error: Cannot find module 'fs-extra'
   ```
   **解决方案：** 在 Cloudflare 构建设置中添加安装命令
   ```
   Build command: npm install && node _build-cloudflare.js
   ```

2. **业务域名验证失败**
   - 确保校验文件已正确上传到项目根目录
   - 确保 Cloudflare 重新部署完成
   - 在浏览器中直接访问校验文件 URL 测试

3. **小程序加载白屏**
   - 检查 webview.js 中的 URL 是否正确
   - 确认业务域名配置无误
   - 查看开发者工具的网络请求日志

## 📝 检查清单

部署完成后，请确认以下所有项目：

- [ ] Cloudflare Pages 项目创建成功
- [ ] 获得了 `https://xxx.pages.dev` 域名
- [ ] 微信公众平台添加了业务域名
- [ ] 微信校验文件已上传并验证通过
- [ ] `miniprogram-config.js` 已更新正确域名
- [ ] 小程序重新构建并上传
- [ ] 手机预览测试通过

## 🎉 完成！

恭喜！您的小程序现在应该能够正常加载 H5 页面了。用户打开小程序时，会看到部署在 Cloudflare 上的音乐会页面。

如果遇到任何问题，请检查上述步骤是否都正确完成。