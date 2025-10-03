# 🔧 联系人二维码修复指南

## 问题说明
联系人二维码不显示，因为引用了不存在的 CDN 链接：
```
https://cdn.yourdomain.com/qrcode/aiyin-wechat-qr.jpg
```

## 解决方案

### 方案 1：添加实际的二维码图片
1. **准备二维码图片**
   - 生成微信群或个人二维码
   - 保存为 `.jpg` 或 `.png` 格式
   - 建议尺寸：200x200 像素

2. **添加到项目**
   ```bash
   # 将二维码图片复制到 static/images/ 目录
   cp /path/to/your/qrcode.jpg ./static/images/contact-qr.jpg
   ```

3. **更新 HTML 代码**
   将 index.html 中的图片路径改为：
   ```html
   <img src="static/images/contact-qr.jpg" 
        alt="联系我们微信二维码"
        class="w-32 h-32 rounded-lg">
   ```

### 方案 2：使用在线二维码生成
如果没有现成的二维码，可以：
1. 访问二维码生成网站
2. 输入微信号或联系方式
3. 下载生成的二维码

### 方案 3：临时移除二维码部分
如果暂时不需要二维码，可以：
- 保持当前的占位符显示
- 或者完全移除这部分代码

## 当前状态
- ✅ 已修复为占位符显示
- ⏳ 待添加实际二维码图片