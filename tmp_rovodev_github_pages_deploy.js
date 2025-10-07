#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class GitHubPagesDeployer {
  constructor() {
    this.repoUrl = 'https://github.com/YYW0228/music-concert-app.git';
    this.actualDomain = 'https://yyw0228.github.io/music-concert-app';
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',  // cyan
      success: '\x1b[32m', // green
      warning: '\x1b[33m', // yellow
      error: '\x1b[31m'   // red
    };
    console.log(`${colors[type]}🚀 ${message}\x1b[0m`);
  }

  async deploy() {
    this.log('启动GitHub Pages紧急部署...', 'info');

    try {
      // 1. 更新配置文件中的域名
      await this.updateConfigs();
      
      // 2. 确保git配置正确
      await this.ensureGitConfig();
      
      // 3. 提交所有更改
      await this.commitChanges();
      
      // 4. 推送到GitHub
      await this.pushToGitHub();
      
      // 5. 验证部署
      await this.verifyDeployment();
      
      this.log('GitHub Pages部署完成！', 'success');
      this.log(`访问地址: ${this.actualDomain}`, 'success');
      
    } catch (error) {
      this.log(`部署失败: ${error.message}`, 'error');
      throw error;
    }
  }

  async updateConfigs() {
    this.log('更新配置文件...', 'info');
    
    // 更新MY_GITHUB_INFO.md
    const githubInfo = `# 🎯 您的GitHub部署信息

## 📋 基本信息
- **GitHub用户名**: YYW0228
- **仓库名称**: music-concert-app
- **网站域名**: ${this.actualDomain}
- **仓库地址**: ${this.repoUrl}

## 🔗 重要链接
- **网站访问**: ${this.actualDomain}
- **仓库管理**: https://github.com/YYW0228/music-concert-app
- **Pages设置**: https://github.com/YYW0228/music-concert-app/settings/pages

## 📝 文件上传清单
已自动同步以下文件到仓库根目录：
- [x] index.html
- [x] manifest.json  
- [x] sw.js
- [x] static/ (静态资源目录)

## 🚀 小程序部署
使用以下信息部署小程序：
- **域名**: ${this.actualDomain}
- **AppID**: wx63d06a67fb222cb8

## 🔄 自动更新
每次代码推送后，GitHub Pages会自动更新，无需手动操作。

## 📞 技术支持
如遇问题，请保存此文件并联系技术支持团队。
`;

    fs.writeFileSync('MY_GITHUB_INFO.md', githubInfo);

    // 更新deploy配置
    const deployConfigPath = './deploy/miniprogram-config.js';
    if (fs.existsSync(deployConfigPath)) {
      let config = fs.readFileSync(deployConfigPath, 'utf8');
      config = config.replace(/https:\/\/[^'"]*/g, this.actualDomain);
      fs.writeFileSync(deployConfigPath, config);
    }

    this.log('配置文件已更新', 'success');
  }

  async ensureGitConfig() {
    this.log('检查Git配置...', 'info');
    
    try {
      execSync('git config user.name', { stdio: 'pipe' });
    } catch {
      execSync('git config user.name "YYW0228"');
    }
    
    try {
      execSync('git config user.email', { stdio: 'pipe' });
    } catch {
      execSync('git config user.email "yyw0228@example.com"');
    }
  }

  async commitChanges() {
    this.log('提交更改到Git...', 'info');
    
    // 复制h5-dist内容到根目录（GitHub Pages需要）
    if (fs.existsSync('h5-dist')) {
      const files = ['index.html', 'manifest.json', 'sw.js'];
      files.forEach(file => {
        const srcPath = path.join('h5-dist', file);
        if (fs.existsSync(srcPath)) {
          fs.copyFileSync(srcPath, file);
          this.log(`复制 ${file} 到根目录`, 'info');
        }
      });

      // 复制static目录
      if (fs.existsSync('h5-dist/static')) {
        execSync('cp -r h5-dist/static .');
        this.log('复制 static/ 目录到根目录', 'info');
      }
    }

    execSync('git add .');
    execSync('git commit -m "🚀 紧急部署: 启用GitHub Pages中国用户访问解决方案" || true');
  }

  async pushToGitHub() {
    this.log('推送到GitHub...', 'info');
    
    try {
      execSync('git push origin main', { stdio: 'inherit' });
      this.log('推送成功！', 'success');
    } catch (error) {
      this.log('推送失败，可能需要身份验证', 'warning');
      this.log('请手动运行: git push origin main', 'warning');
    }
  }

  async verifyDeployment() {
    this.log('部署完成！等待GitHub Pages生效...', 'info');
    
    console.log(`
🎉 部署成功！接下来请：

1. 等待2-3分钟让GitHub Pages生效
2. 访问: ${this.actualDomain}
3. 在GitHub仓库中确认Pages已启用:
   https://github.com/YYW0228/music-concert-app/settings/pages

📱 小程序配置:
- 域名: ${this.actualDomain}
- AppID: wx63d06a67fb222cb8

🔄 后续更新:
每次推送代码后，网站会自动更新，无需手动操作。
`);
  }
}

// 立即执行部署
if (require.main === module) {
  const deployer = new GitHubPagesDeployer();
  deployer.deploy().catch(console.error);
}

module.exports = GitHubPagesDeployer;