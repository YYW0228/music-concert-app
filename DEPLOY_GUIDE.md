
# 🚀 营地主题音乐会部署指南

## 📋 部署检查清单

### 1. H5页面部署
- [ ] 将 h5-dist/ 目录下的所有文件上传到: https://YYW0228.github.io/music-concert
- [ ] 确认 https://YYW0228.github.io/music-concert/index.html 可以正常访问
- [ ] 确认HTTPS证书有效

### 2. 小程序配置
- [ ] 登录微信小程序后台: https://mp.weixin.qq.com
- [ ] 在【开发】->【开发设置】->【业务域名】中添加: https://YYW0228.github.io/music-concert
- [ ] 下载校验文件并上传到服务器根目录

### 3. 小程序部署
方式一：使用微信开发者工具
- [ ] 打开微信开发者工具
- [ ] 导入项目，选择 dist/ 目录
- [ ] AppID: wx63d06a67fb222cb8
- [ ] 点击【上传】，填写版本号和项目备注

方式二：使用命令行工具
```bash
# 安装微信开发者工具命令行
npm install -g miniprogram-cli

# 登录（首次使用）
cli login

# 上传代码
cli upload --project ./dist
```

### 4. 小程序发布
- [ ] 在小程序后台【版本管理】中提交审核
- [ ] 审核通过后点击【发布】

## 📞 技术支持
如遇问题，请联系技术支持团队。

## 📝 更新日志
- v1.0.0: 初始版本发布
  - 营地主题音乐会节目单
  - PWA离线支持
  - 久石让钢琴背景音乐
