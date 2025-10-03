# 🎵 营地主题音乐会 - 微信小程序 + PWA

一个完整的音乐会电子节目单解决方案，支持微信小程序和PWA，包含久石让钢琴曲背景音乐。

## ✨ 功能特色

- 🎼 **久石让钢琴曲**：循环播放营造温馨氛围
- 📱 **微信小程序**：WebView无缝嵌入，一键分享
- 🌐 **PWA支持**：离线访问，可安装到桌面
- 🎨 **营地主题**：简约大气的视觉设计
- 📊 **数据可视化**：节目统计图表
- 🔍 **智能筛选**：按乐器类型筛选节目
- 📞 **微信二维码**：CDN优化，懒加载

## 🚀 一键部署

### 方式一：使用一键脚本（推荐）

```bash
# 克隆或下载项目到本地
# 运行一键部署脚本
chmod +x scripts/one-click-deploy.sh
./scripts/one-click-deploy.sh
```

### 方式二：手动步骤

```bash
# 1. 安装依赖
npm install

# 2. 运行配置向导
npm run setup

# 3. 部署
npm run deploy
```

## 📋 准备清单

在开始部署前，请准备以下信息：

### 🔑 微信小程序信息
- **AppID**：在 [微信小程序后台](https://mp.weixin.qq.com) 获取
- **小程序名称**：已注册的小程序名称
- **管理员权限**：确保有权限管理小程序

### 🌐 服务器信息  
- **HTTPS域名**：已备案的域名（如：https://example.com）
- **服务器权限**：可以上传文件到服务器
- **SSL证书**：确保HTTPS正常工作

### 🛠 开发工具
- **Node.js**：版本 >= 14.0.0
- **微信开发者工具**：[下载地址](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)

## 📁 项目结构

```
营地主题音乐会/
├── 📱 小程序文件
│   ├── app.json                  # 小程序配置
│   └── pages/webview/           # WebView页面
│       ├── webview.wxml         # 页面结构
│       ├── webview.wxss         # 页面样式
│       ├── webview.js           # 页面逻辑
│       └── webview.json         # 页面配置
│
├── 🌐 H5文件
│   ├── index.html               # 主页面
│   ├── manifest.json            # PWA配置
│   ├── sw.js                    # Service Worker
│   └── 2025-10-02 18.03.32.jpg # 微信二维码
│
├── 🚀 部署工具
│   ├── deploy/                  # 部署配置
│   ├── scripts/                 # 脚本工具
│   └── package.json             # 项目依赖
│
└── 📖 文档
    ├── README.md                # 项目说明
    ├── DEPLOY_GUIDE.md          # 部署指南
    └── NEXT_STEPS.md            # 下一步操作
```

## 🎯 部署流程

### 第一步：配置信息
运行 `npm run setup` 后按提示输入：
- 微信小程序AppID
- 网站HTTPS域名
- 项目名称和版本信息

### 第二步：文件部署
1. **H5文件**：将 `h5-dist/` 目录内容上传到服务器
2. **测试访问**：确认 `https://your-domain.com/index.html` 可正常访问

### 第三步：小程序配置
1. 登录 [微信小程序后台](https://mp.weixin.qq.com)
2. 【开发】→【开发设置】→【业务域名】
3. 添加您的域名并上传校验文件

### 第四步：小程序上传
1. 用微信开发者工具打开 `dist/` 目录
2. 输入AppID并登录
3. 点击【上传】，填写版本信息
4. 在小程序后台提交审核

## 🎵 音乐功能

### 音频特色
- **久石让风格**：钢琴时刻、回忆等经典曲目
- **智能播放**：用户交互后自动播放
- **循环播放**：营造持续的温馨氛围
- **多重备选**：网络音频 + Web Audio API

### 播放逻辑
1. 页面加载后显示播放提示
2. 用户点击任意位置开始播放
3. 支持手动播放/暂停控制
4. 网络失败时自动切换到本地生成音频

## 🌐 PWA功能

### 核心特性
- **离线访问**：缓存静态资源，无网络也能查看
- **桌面安装**：可安装到手机桌面和电脑
- **推送通知**：音乐会开始前的提醒
- **快速加载**：Service Worker缓存策略

### 浏览器支持
- ✅ Chrome/Edge (推荐)
- ✅ Safari (iOS)
- ✅ Firefox
- ✅ 微信内置浏览器

## 🎨 自定义配置

### 修改音乐
编辑 `index.html` 中的音频源：
```html
<audio id="bg-music" loop preload="metadata">
    <source src="你的音乐文件.mp3" type="audio/mpeg">
</audio>
```

### 修改主题色
在 `index.html` 的CSS中修改：
```css
.text-grass-green { color: #你的颜色; }
.bg-grass-green { background-color: #你的颜色; }
```

### 修改节目数据
编辑 `index.html` 中的 `programData` 数组。

## 🔧 故障排除

### 常见问题

**音乐无法播放**
- 确认音频文件URL可访问
- 检查浏览器自动播放策略
- 尝试用户手动点击播放

**小程序WebView显示空白**
- 检查业务域名配置
- 确认HTTPS证书有效
- 查看小程序开发者工具调试信息

**PWA无法安装**
- 确认manifest.json配置正确
- 检查Service Worker注册
- 使用HTTPS协议访问

### 技术支持
- 📧 邮箱：support@example.com
- 📱 微信：技术支持群
- 📖 文档：详见 DEPLOY_GUIDE.md

## 📄 许可证

MIT License - 详见 LICENSE 文件

## 🙏 致谢

- 久石让 - 音乐灵感
- 微信小程序团队
- PWA开发社区

---

**🎊 祝您的音乐会圆满成功！**