#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

class SetupWizard {
  constructor() {
    this.configPath = path.join(__dirname, '../deploy/miniprogram-config.js');
    this.config = {};
  }

  async askQuestion(question) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer.trim());
      });
    });
  }

  async collectConfig() {
    console.log('🎯 营地主题音乐会小程序配置向导\n');
    console.log('请按照提示输入相关信息：\n');

    // 收集AppID
    console.log('📱 微信小程序信息');
    console.log('请在微信小程序后台(mp.weixin.qq.com)【开发】->【开发设置】中查看');
    this.config.appId = await this.askQuestion('🔑 小程序AppID: ');
    
    if (!this.config.appId || this.config.appId.length !== 18) {
      console.log('❌ AppID格式不正确，应该是18位字符，如: wx1234567890abcdef');
      process.exit(1);
    }

    // 收集域名
    console.log('\n🌐 网站域名信息');
    console.log('请确保域名已备案且支持HTTPS');
    this.config.webDomain = await this.askQuestion('🔗 您的网站域名 (如: https://example.com): ');
    
    if (!this.config.webDomain.startsWith('https://')) {
      console.log('❌ 域名必须使用HTTPS协议');
      process.exit(1);
    }

    // 收集项目信息
    console.log('\n📝 项目信息');
    this.config.projectName = await this.askQuestion('📋 小程序名称 [营地主题音乐会]: ') || '营地主题音乐会';
    this.config.version = await this.askQuestion('🔢 版本号 [1.0.0]: ') || '1.0.0';
    this.config.description = await this.askQuestion('📄 版本描述 [营地主题音乐会首次发布]: ') || '营地主题音乐会首次发布';

    console.log('\n✅ 配置信息收集完成！');
  }

  generateConfig() {
    const configContent = `// 微信小程序部署配置 - 自动生成
module.exports = {
  // 微信小程序基本信息
  appId: '${this.config.appId}',
  privateKeyPath: './private.key',
  
  // H5页面部署域名
  webDomain: '${this.config.webDomain}',
  
  // 小程序基本信息
  projectConfig: {
    appid: '${this.config.appId}',
    projectname: '${this.config.projectName}',
    setting: {
      urlCheck: false,
      es6: true,
      enhance: true,
      postcss: true,
      preloadBackgroundData: false,
      minified: true,
      newFeature: false,
      coverView: true,
      nodeModules: false,
      autoAudits: false,
      showShadowRootInWxmlPanel: true,
      scopeDataCheck: false,
      checkInvalidKey: true,
      checkSiteMap: true,
      uploadWithSourceMap: true,
      compileHotReLoad: false,
      babelSetting: {
        ignore: [],
        disablePlugins: [],
        outputPath: ''
      },
      useIsolateContext: true,
      useCompilerModule: true,
      userConfirmedUseCompilerModuleSwitch: false
    },
    compileType: 'miniprogram',
    libVersion: '2.14.1',
    appid: '${this.config.appId}',
    projectname: '${this.config.projectName}',
    debugOptions: {
      hidedInDevtools: []
    },
    scripts: {},
    isGameTourist: false,
    simulatorType: 'wechat',
    simulatorPluginLibVersion: {},
    condition: {
      search: { current: -1, list: [] },
      conversation: { current: -1, list: [] },
      game: { current: -1, list: [] },
      plugin: { current: -1, list: [] },
      gamePlugin: { current: -1, list: [] },
      miniprogram: { current: -1, list: [] }
    }
  },
  
  // 业务域名配置
  webviewDomains: [
    '${this.config.webDomain}'
  ],
  
  // 上传配置
  uploadConfig: {
    version: '${this.config.version}',
    desc: '${this.config.description}',
    setting: {
      es6: true,
      minify: true,
      codeProtect: false,
      autoPrefixWXSS: true
    }
  }
};`;

    fs.writeFileSync(this.configPath, configContent);
    console.log('⚙️  配置文件已生成: deploy/miniprogram-config.js');
  }

  generateNextSteps() {
    const steps = `
🎉 配置完成！接下来的步骤：

📋 部署清单：

1. 📤 H5文件部署
   将以下文件上传到您的服务器 ${this.config.webDomain}：
   - index.html
   - manifest.json  
   - sw.js
   - 2025-10-02 18.03.32.jpg
   - icons/ 目录（如果有）

2. 🔧 微信小程序后台配置
   访问: https://mp.weixin.qq.com
   - 【开发】->【开发设置】->【业务域名】
   - 添加域名: ${this.config.webDomain}
   - 下载校验文件上传到服务器

3. 🚀 部署小程序
   运行命令: npm run deploy

📞 需要帮助？
- 查看详细部署指南: DEPLOY_GUIDE.md
- 技术支持: 联系开发团队

🎯 快速开始:
npm run deploy
`;

    console.log(steps);
    fs.writeFileSync(path.join(__dirname, '../NEXT_STEPS.md'), steps);
  }

  async run() {
    try {
      await this.collectConfig();
      this.generateConfig();
      this.generateNextSteps();
      
      console.log('\n🎊 设置向导完成！');
      console.log('📝 详细步骤请查看: NEXT_STEPS.md');
      
      const runDeploy = await this.askQuestion('\n🚀 是否立即开始部署？(y/N): ');
      if (runDeploy.toLowerCase() === 'y' || runDeploy.toLowerCase() === 'yes') {
        console.log('\n正在启动部署...');
        require('../deploy/deploy.js');
      }
      
    } catch (error) {
      console.error('❌ 设置失败:', error.message);
      process.exit(1);
    }
  }
}

// 运行设置向导
if (require.main === module) {
  const wizard = new SetupWizard();
  wizard.run();
}

module.exports = SetupWizard;