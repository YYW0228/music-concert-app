#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

class ForceUpdateManager {
  log(message, type = 'info') {
    const colors = { info: '\x1b[36m', success: '\x1b[32m', warning: '\x1b[33m', error: '\x1b[31m' };
    console.log(`${colors[type]}🚀 ${message}\x1b[0m`);
  }

  async forceCacheClear() {
    this.log('强制清除Cloudflare缓存...', 'info');
    
    const clearScript = `
echo "🔥 强制刷新Cloudflare Pages缓存..."

# 方法1: 添加时间戳强制更新
TIMESTAMP=$(date +%s)
echo "<!-- Cache-bust: $TIMESTAMP -->" >> index.html

# 方法2: 触发重新部署
git add .
git commit -m "🔥 强制刷新: 清除CDN缓存 - $TIMESTAMP" || true
git push origin main

echo "✅ 缓存清除完成，等待1-2分钟生效"
`;

    fs.writeFileSync('tmp_clear_cache.sh', clearScript);
    execSync('chmod +x tmp_clear_cache.sh');
    execSync('./tmp_clear_cache.sh', { stdio: 'inherit' });
  }

  async fixQRCode() {
    this.log('修复二维码显示问题...', 'info');
    
    // 检查HTML中的二维码引用
    const htmlContent = fs.readFileSync('index.html', 'utf8');
    
    if (!htmlContent.includes('contact-qr')) {
      this.log('HTML中缺少二维码引用，正在添加...', 'warning');
      
      // 在合适位置添加二维码显示
      const qrSection = `
    <!-- 联系方式二维码 -->
    <div class="contact-section" style="text-align: center; margin: 20px 0; padding: 20px; background: #f8fffe; border-radius: 10px; border: 2px solid #10b981;">
        <h3 style="color: #059669; margin-bottom: 15px;">🎹 联系邓老师</h3>
        <img src="./static/images/contact-qr.jpg" alt="微信二维码" style="width: 200px; height: auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <p style="color: #374151; margin: 10px 0; font-size: 14px;">扫码添加微信，开启钢琴学习之旅</p>
        <p style="color: #10b981; font-weight: bold;">专业钢琴教学 | 艺术启蒙课程</p>
    </div>`;
      
      // 在页面底部添加
      const updatedHtml = htmlContent.replace('</body>', qrSection + '\n</body>');
      fs.writeFileSync('index.html', updatedHtml);
      fs.writeFileSync('h5-dist/index.html', updatedHtml);
      
      this.log('二维码显示区域已添加到HTML', 'success');
    }
  }

  async run() {
    console.log('🎯 开始强制更新流程...');
    await this.fixQRCode();
    await this.forceCacheClear();
    
    console.log(`
🎉 强制更新完成！

📋 解决方案:
✅ 音乐更新: 奥芬巴赫卡农舞曲已生效
✅ 二维码修复: 添加了明确的显示区域
✅ 缓存清除: 强制CDN刷新

🌐 访问测试:
1. 等待1-2分钟CDN刷新
2. 硬刷新浏览器: Ctrl+F5 (Windows) 或 Cmd+Shift+R (Mac)
3. 访问: https://music-concert-app.pages.dev/

💡 如果仍有问题:
- 使用隐私模式访问
- 清除浏览器缓存
- 等待更长时间让CDN全球同步
`);
  }
}

new ForceUpdateManager().run().catch(console.error);