#!/usr/bin/env node

// 🔄 自动更新脚本 - 防止终端中断的解决方案
const fs = require('fs');
const { execSync } = require('child_process');

class DataUpdater {
  async updateAndDeploy() {
    console.log('🚀 开始自动更新...');
    
    try {
      // 1. 重新构建h5文件
      if (fs.existsSync('scripts/deploy-h5.js')) {
        console.log('📦 重新构建H5文件...');
        execSync('node scripts/deploy-h5.js', { stdio: 'inherit' });
      }

      // 2. 复制最新文件到根目录
      console.log('📋 复制文件到GitHub Pages根目录...');
      const files = ['index.html', 'manifest.json', 'sw.js'];
      files.forEach(file => {
        const srcPath = `h5-dist/${file}`;
        if (fs.existsSync(srcPath)) {
          fs.copyFileSync(srcPath, file);
          console.log(`✅ 复制 ${file}`);
        }
      });

      // 复制静态资源
      if (fs.existsSync('h5-dist/static')) {
        execSync('cp -r h5-dist/static .', { stdio: 'pipe' });
        console.log('✅ 复制 static/ 目录');
      }

      // 3. 提交并推送
      console.log('🔄 提交更改...');
      execSync('git add .', { stdio: 'pipe' });
      execSync(`git commit -m "🔄 自动更新数据 - ${new Date().toLocaleString('zh-CN')}"`, { stdio: 'pipe' });
      execSync('git push origin main', { stdio: 'inherit' });

      console.log('🎉 自动更新完成！');
      console.log('🌐 网站将在1-2分钟内更新: https://yyw0228.github.io/music-concert-app');
      
    } catch (error) {
      console.error('❌ 更新失败:', error.message);
      process.exit(1);
    }
  }
}

new DataUpdater().updateAndDeploy();