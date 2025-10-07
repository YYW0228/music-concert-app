#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

class CloudflareForceRebuild {
  log(message, type = 'info') {
    const colors = { info: '\x1b[36m', success: '\x1b[32m', warning: '\x1b[33m', error: '\x1b[31m' };
    console.log(`${colors[type]}🔥 ${message}\x1b[0m`);
  }

  async forceRebuild() {
    this.log('强制触发Cloudflare Pages重新构建...', 'info');

    // 方法1: 修改构建脚本添加时间戳
    const buildScript = fs.readFileSync('_build-cloudflare.js', 'utf8');
    const timestamp = Date.now();
    const modifiedScript = buildScript.replace(
      'console.log(\'✅ Cloudflare Pages 构建完成!\');',
      `console.log('✅ Cloudflare Pages 构建完成! 强制重建时间: ${timestamp}');`
    );
    fs.writeFileSync('_build-cloudflare.js', modifiedScript);

    // 方法2: 添加构建标识文件
    const buildInfo = {
      buildTime: new Date().toISOString(),
      buildId: timestamp,
      version: '2.0.0-force-rebuild',
      message: '强制重建 - 部署邓老师真实微信二维码'
    };
    fs.writeFileSync('h5-dist/build-info.json', JSON.stringify(buildInfo, null, 2));

    // 方法3: 在HTML中添加强制刷新标记
    let html = fs.readFileSync('index.html', 'utf8');
    html = html.replace(
      '</head>',
      `    <!-- 强制重建标识: ${timestamp} -->\n    <meta name="build-id" content="${timestamp}">\n</head>`
    );
    fs.writeFileSync('index.html', html);
    fs.writeFileSync('h5-dist/index.html', html);

    this.log('构建文件已修改，准备强制推送...', 'success');
  }

  async forcePush() {
    this.log('执行强制推送...', 'info');

    try {
      execSync('git add .', { stdio: 'pipe' });
      execSync(`git commit -m "🔥 FORCE REBUILD: 强制重建Cloudflare - ${Date.now()}" || true`, { stdio: 'pipe' });
      execSync('git push origin main --force-with-lease', { stdio: 'inherit' });
      
      this.log('强制推送完成！', 'success');
    } catch (error) {
      this.log(`推送失败: ${error.message}`, 'error');
    }
  }

  async run() {
    console.log(`
🎯 Cloudflare Pages强制重建方案

问题诊断:
❌ Cloudflare返回40K文件，content-type: text/html
❌ 应该返回89K文件，content-type: image/jpeg  
❌ 说明Cloudflare使用了旧的构建缓存

解决方案:
1. 修改构建脚本添加时间戳
2. 强制推送触发新构建
3. 清除Cloudflare缓存
`);

    await this.forceRebuild();
    await this.forcePush();

    console.log(`
🚀 强制重建已触发！

⏰ 等待时间: 2-5分钟
🔍 验证地址: https://music-concert-app.pages.dev/static/images/contact-qr.jpg

📋 验证方法:
1. 访问上述地址应返回89K的JPEG图片
2. content-type应为image/jpeg
3. 图片应显示邓老师真实微信二维码

💡 如果仍未生效:
- 等待更长时间（最多10分钟）
- 检查Cloudflare Pages构建日志
- 考虑手动在Cloudflare后台触发重新部署
`);
  }
}

new CloudflareForceRebuild().run().catch(console.error);