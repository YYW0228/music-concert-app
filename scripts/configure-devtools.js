#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class DevToolsConfigurator {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.devToolsPath = '/Volumes/微信开发者工具 Stable ARM64/Applications';
    this.cliPath = path.join(this.devToolsPath, 'wechatwebdevtools.app/Contents/MacOS/cli');
  }

  // 检查微信开发者工具是否安装
  checkDevTools() {
    console.log('🔍 检查微信开发者工具安装状态...');
    
    if (fs.existsSync(this.devToolsPath)) {
      console.log('✅ 找到微信开发者工具:', this.devToolsPath);
    } else {
      console.log('❌ 未找到微信开发者工具');
      console.log('请确认微信开发者工具已安装到:', this.devToolsPath);
      return false;
    }

    // 检查CLI工具
    if (fs.existsSync(this.cliPath)) {
      console.log('✅ 找到CLI工具:', this.cliPath);
    } else {
      console.log('⚠️  CLI工具未找到，尝试启用...');
      this.enableCLI();
    }

    return true;
  }

  // 启用CLI工具
  enableCLI() {
    try {
      console.log('🔧 正在启用微信开发者工具CLI...');
      
      // 添加CLI到PATH
      const shellRC = path.join(require('os').homedir(), '.zshrc');
      const cliAlias = `\n# 微信开发者工具CLI\nalias wx-cli="${this.cliPath}"\nexport PATH="$PATH:${path.dirname(this.cliPath)}"\n`;
      
      if (fs.existsSync(shellRC)) {
        const rcContent = fs.readFileSync(shellRC, 'utf8');
        if (!rcContent.includes('微信开发者工具CLI')) {
          fs.appendFileSync(shellRC, cliAlias);
          console.log('✅ CLI别名已添加到 ~/.zshrc');
          console.log('请运行: source ~/.zshrc 或重启终端');
        }
      }

      // 尝试直接调用CLI
      execSync(`"${this.cliPath}" --help`, { stdio: 'ignore' });
      console.log('✅ CLI工具可正常使用');
      
    } catch (error) {
      console.log('⚠️  CLI启用失败，将使用手动部署方式');
      console.log('请在微信开发者工具中: 设置 -> 安全设置 -> 开启服务端口');
    }
  }

  // 创建开发者工具配置
  createDevToolsConfig() {
    console.log('⚙️  创建开发者工具配置...');
    
    const config = {
      devToolsPath: this.devToolsPath,
      cliPath: this.cliPath,
      projectPath: path.join(this.projectRoot, 'dist'),
      appId: 'wxb903ef55b0a982ad',
      projectName: '营地主题音乐会'
    };

    fs.writeFileSync(
      path.join(this.projectRoot, 'devtools-config.json'),
      JSON.stringify(config, null, 2)
    );

    console.log('✅ 开发者工具配置已保存到 devtools-config.json');
    return config;
  }

  // 生成部署脚本
  generateDeployScript() {
    const scriptContent = `#!/bin/bash

# 营地主题音乐会 - 微信开发者工具部署脚本
echo "🚀 开始部署营地主题音乐会..."

# 1. 运行构建
echo "📦 构建项目..."
npm run deploy

# 2. 打开微信开发者工具
echo "🔧 打开微信开发者工具..."
open "${this.devToolsPath}/wechatwebdevtools.app"

# 3. 提示用户操作
echo ""
echo "📱 接下来请在微信开发者工具中操作："
echo "1. 点击 '导入项目'"
echo "2. 选择项目目录: $(pwd)/dist"
echo "3. AppID: wxb903ef55b0a982ad"
echo "4. 项目名称: 营地主题音乐会"
echo "5. 点击 '导入'"
echo "6. 预览无误后点击 '上传' 按钮"
echo ""
echo "🌐 H5文件位置: $(pwd)/h5-dist"
echo "📖 详细部署指南: $(pwd)/DEPLOY_GUIDE.md"
echo ""
echo "✅ 准备工作完成！"
`;

    const scriptPath = path.join(this.projectRoot, 'deploy-miniprogram.sh');
    fs.writeFileSync(scriptPath, scriptContent);
    
    // 设置执行权限
    try {
      execSync(`chmod +x "${scriptPath}"`);
    } catch (error) {
      console.log('⚠️  设置脚本执行权限失败');
    }

    console.log('✅ 部署脚本已生成: deploy-miniprogram.sh');
  }

  // 主配置流程
  configure() {
    console.log('🎯 配置微信开发者工具集成...\n');

    if (this.checkDevTools()) {
      this.createDevToolsConfig();
      this.generateDeployScript();
      
      console.log('\n✅ 微信开发者工具配置完成！');
      console.log('📝 运行部署: npm run deploy');
      console.log('🚀 快速部署: ./deploy-miniprogram.sh');
    } else {
      console.log('\n❌ 配置失败，请检查微信开发者工具安装路径');
    }
  }
}

// 运行配置
if (require.main === module) {
  const configurator = new DevToolsConfigurator();
  configurator.configure();
}

module.exports = DevToolsConfigurator;