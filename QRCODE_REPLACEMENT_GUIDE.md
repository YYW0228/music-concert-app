# 🎯 邓老师微信二维码替换指南

## 📋 当前状态
✅ 音乐更新：奥芬巴赫卡农舞曲已成功部署
✅ 二维码显示：网页端完全可见
⚠️  需要替换：当前为占位符二维码

## 📲 替换步骤

### 方法1: 手动替换（推荐）
1. **生成邓老师真实微信二维码**
   - 打开微信 → 我 → 二维码名片
   - 长按保存图片
   - 建议尺寸：200x200像素，格式：JPG

2. **替换文件**
   请将真实二维码图片命名为 `contact-qr.jpg` 并替换以下位置：
   ```
   static/images/contact-qr.jpg
   h5-dist/static/images/contact-qr.jpg
   ```

3. **重新部署**
   ```bash
   npm run update
   ```

### 方法2: 一键替换脚本
如果您有二维码文件，可以使用以下命令快速替换：

```bash
# 假设您的二维码文件为 deng-teacher-qr.jpg
node tmp_rovodev_qr_replacement_guide.js replace deng-teacher-qr.jpg
```

## 🎯 验证替换效果

替换后访问以下地址验证：
- **Cloudflare**: https://music-concert-app.pages.dev/
- **GitHub Pages**: https://yyw0228.github.io/music-concert-app/

## 📊 预期效果

替换成功后，客户将看到：
1. 🎵 优美的奥芬巴赫卡农舞曲背景音乐
2. 📲 邓老师真实微信二维码
3. 📞 联系电话：17365166266
4. 🏫 艾音艺术教育品牌信息

## 💡 商业价值

真实二维码将带来：
- ✅ 直接的客户联系通道
- ✅ 提高钢琴课程咨询转化率  
- ✅ 建立专业教育品牌形象
- ✅ 方便移动端用户快速添加微信

---
**技术支持**: 如需帮助，请保留此文件
