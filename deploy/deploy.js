#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const config = require('./miniprogram-config');

class MiniprogramDeployer {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.distPath = path.join(this.projectRoot, 'dist');
    this.h5DistPath = path.join(this.projectRoot, 'h5-dist');
  }

  // 检查环境和依赖
  checkEnvironment() {
    console.log('🔍 检查部署环境...');
    
    // 检查必需的配置
    if (!config.appId || config.appId === 'wx1234567890abcdef') {
      throw new Error('❌ 请在 deploy/miniprogram-config.js 中配置正确的 AppID');
    }
    
    if (!config.webDomain || config.webDomain === 'https://your-domain.com') {
      throw new Error('❌ 请在 deploy/miniprogram-config.js 中配置正确的域名');
    }

    // 检查微信开发者工具CLI
    try {
      execSync('which cli', { stdio: 'ignore' });
      console.log('✅ 微信开发者工具CLI已安装');
    } catch (error) {
      console.log('⚠️  微信开发者工具CLI未找到，将使用手动上传方式');
    }

    console.log('✅ 环境检查完成');
  }

  // 准备小程序文件
  prepareMiniprogram() {
    console.log('📦 准备小程序文件...');
    
    // 创建dist目录
    if (!fs.existsSync(this.distPath)) {
      fs.mkdirSync(this.distPath, { recursive: true });
    }

    // 复制小程序文件
    this.copyFiles();
    this.copyStaticImages();
    
    // 更新配置文件
    this.updateConfigs();
    
    console.log('✅ 小程序文件准备完成');
  }

  // 复制文件
  copyFiles() {
    const filesToCopy = [
      'app.json',
      'app.js',
      'pages/webview/webview.wxml',
      'pages/webview/webview.wxss',
      'pages/webview/webview.js',
      'pages/webview/webview.json'
    ];

    filesToCopy.forEach(file => {
      const srcPath = path.join(this.projectRoot, file);
      const destPath = path.join(this.distPath, file);
      
      // 确保目标目录存在
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`📄 复制: ${file}`);
      }
    });
  }

  // 复制静态图片资源
  copyStaticImages() {
    const srcDir = path.join(this.projectRoot, 'static', 'images');
    const destDir = path.join(this.distPath, 'images');
    if (fs.existsSync(srcDir)) {
      console.log('🖼️  复制静态图片资源...');
      const fse = require('fs-extra');
      fse.copySync(srcDir, destDir);
      console.log('✅ 图片资源复制完成');
    }
  }

  // 更新配置文件
  updateConfigs() {
    // 更新webview页面的URL
    const webviewJsPath = path.join(this.distPath, 'pages/webview/webview.js');
    let webviewJs = fs.readFileSync(webviewJsPath, 'utf8');
    webviewJs = webviewJs.replace(
      'https://your-domain.com/index.html',
      `${config.webDomain}/index.html`
    );
    fs.writeFileSync(webviewJsPath, webviewJs);

    // 更新app.json
    const appJsonPath = path.join(this.distPath, 'app.json');
    const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
    fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));

    // 创建project.config.json
    const projectConfigPath = path.join(this.distPath, 'project.config.json');
    const projectConfig = {
      ...config.projectConfig,
      appid: config.appId
    };
    fs.writeFileSync(projectConfigPath, JSON.stringify(projectConfig, null, 2));

    console.log('⚙️  配置文件已更新');
  }

  // 准备H5文件
  prepareH5Files() {
    console.log('🌐 准备H5文件...');
    
    if (!fs.existsSync(this.h5DistPath)) {
      fs.mkdirSync(this.h5DistPath, { recursive: true });
    }

    // 复制H5相关文件
    const h5Files = [
      'index.html',
      'manifest.json',
      'sw.js',
      '2025-10-02 18.03.32.jpg'
    ];

    h5Files.forEach(file => {
      const srcPath = path.join(this.projectRoot, file);
      const destPath = path.join(this.h5DistPath, file);
      
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`🌐 复制H5文件: ${file}`);
      }
    });

    console.log('✅ H5文件准备完成');
  }

  // 生成部署说明
  generateDeployGuide() {
    const guide = `
# 🚀 营地主题音乐会部署指南

## 📋 部署检查清单

### 1. H5页面部署
- [ ] 将 h5-dist/ 目录下的所有文件上传到: ${config.webDomain}
- [ ] 确认 ${config.webDomain}/index.html 可以正常访问
- [ ] 确认HTTPS证书有效

### 2. 小程序配置
- [ ] 登录微信小程序后台: https://mp.weixin.qq.com
- [ ] 在【开发】->【开发设置】->【业务域名】中添加: ${config.webDomain}
- [ ] 下载校验文件并上传到服务器根目录

### 3. 小程序部署
方式一：使用微信开发者工具
- [ ] 打开微信开发者工具
- [ ] 导入项目，选择 dist/ 目录
- [ ] AppID: ${config.appId}
- [ ] 点击【上传】，填写版本号和项目备注

方式二：使用命令行工具
\`\`\`bash
# 安装微信开发者工具命令行
npm install -g miniprogram-cli

# 登录（首次使用）
cli login

# 上传代码
cli upload --project ./dist
\`\`\`

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
`;

    fs.writeFileSync(path.join(this.projectRoot, 'DEPLOY_GUIDE.md'), guide);
    console.log('📝 部署指南已生成: DEPLOY_GUIDE.md');
  }

  // 自动上传(如果有CLI工具)
  async autoUpload() {
    try {
      console.log('🚀 尝试自动上传到微信小程序...');
      
      const uploadCommand = `cli upload --project ${this.distPath} --version ${config.uploadConfig.version} --desc "${config.uploadConfig.desc}"`;
      
      execSync(uploadCommand, { 
        stdio: 'inherit',
        cwd: this.distPath 
      });
      
      console.log('✅ 自动上传成功！');
      console.log('📱 请在微信小程序后台查看并提交审核');
      
    } catch (error) {
      console.log('⚠️  自动上传失败，请使用微信开发者工具手动上传');
      console.log('📖 详见 DEPLOY_GUIDE.md 中的手动部署步骤');
    }
  }

  // 主部署流程
  async deploy() {
    try {
      console.log('🎯 开始部署营地主题音乐会...\n');
      
      this.checkEnvironment();
      this.prepareMiniprogram();
      this.prepareH5Files();
      this.generateDeployGuide();
      
      console.log('\n✅ 所有文件准备完成！');
      console.log('📁 小程序文件位置: ./dist/');
      console.log('🌐 H5文件位置: ./h5-dist/');
      console.log('📖 部署指南: ./DEPLOY_GUIDE.md');
      
      // 询问是否尝试自动上传
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      readline.question('\n🤖 是否尝试自动上传到微信小程序？(y/N): ', async (answer) => {
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
          await this.autoUpload();
        } else {
          console.log('📝 请按照 DEPLOY_GUIDE.md 进行手动部署');
        }
        readline.close();
      });
      
    } catch (error) {
      console.error('❌ 部署失败:', error.message);
      process.exit(1);
    }
  }
}

// 运行部署
if (require.main === module) {
  const deployer = new MiniprogramDeployer();
  deployer.deploy();
}

module.exports = MiniprogramDeployer;