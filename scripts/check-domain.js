#!/usr/bin/env node

const readline = require('readline');

class DomainChecker {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async askQuestion(question) {
    return new Promise((resolve) => {
      this.rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  async checkCurrentSituation() {
    console.log('🔍 让我们来确认您的域名情况\n');

    // 检查是否有现有网站
    const hasWebsite = await this.askQuestion('❓ 您是否已经有自己的网站？(y/n): ');
    
    if (hasWebsite.toLowerCase() === 'y' || hasWebsite.toLowerCase() === 'yes') {
      const websiteUrl = await this.askQuestion('🌐 请输入您的网站地址 (如: https://www.example.com): ');
      await this.validateExistingDomain(websiteUrl);
    } else {
      await this.suggestDomainOptions();
    }
  }

  async validateExistingDomain(url) {
    console.log(`\n✅ 太好了！您的域名是: ${url}`);
    console.log('\n📋 接下来需要确认几个要点：');
    
    // 检查HTTPS
    if (!url.startsWith('https://')) {
      console.log('⚠️  注意：微信小程序要求必须使用HTTPS协议');
      console.log('💡 如果您的网站不支持HTTPS，需要先配置SSL证书');
    } else {
      console.log('✅ HTTPS协议 - 符合要求');
    }

    // 检查文件上传权限
    const canUpload = await this.askQuestion('\n📁 您能否上传文件到这个网站的根目录？(y/n): ');
    
    if (canUpload.toLowerCase() === 'y' || canUpload.toLowerCase() === 'yes') {
      console.log('✅ 文件上传权限 - 符合要求');
      console.log(`\n🎉 完美！您可以使用域名: ${url}`);
      console.log('\n📝 请将此域名保存好，部署时需要输入');
      await this.generateNextSteps(url);
    } else {
      console.log('❌ 需要文件上传权限才能部署');
      await this.suggestSolutions();
    }
  }

  async suggestDomainOptions() {
    console.log('\n💡 没关系！我来为您推荐几种获取域名的方案：\n');
    
    console.log('🏆 **推荐方案（按简单程度排序）：**\n');
    
    console.log('1️⃣ **使用GitHub Pages（免费）**');
    console.log('   ✅ 完全免费');
    console.log('   ✅ 自动HTTPS');
    console.log('   ✅ 操作简单');
    console.log('   🔗 域名格式: https://用户名.github.io/项目名');
    console.log('   📖 教程: https://pages.github.com/\n');
    
    console.log('2️⃣ **使用Netlify（免费）**');
    console.log('   ✅ 完全免费');
    console.log('   ✅ 自动HTTPS');
    console.log('   ✅ 操作简单，拖拽上传');
    console.log('   🔗 域名格式: https://项目名.netlify.app');
    console.log('   📖 网址: https://netlify.com\n');
    
    console.log('3️⃣ **使用Vercel（免费）**');
    console.log('   ✅ 完全免费');
    console.log('   ✅ 自动HTTPS');
    console.log('   ✅ 部署速度快');
    console.log('   🔗 域名格式: https://项目名.vercel.app');
    console.log('   📖 网址: https://vercel.com\n');
    
    console.log('4️⃣ **购买域名+主机**');
    console.log('   💰 需要费用（约100-300元/年）');
    console.log('   ✅ 自定义域名');
    console.log('   ✅ 完全控制权');
    console.log('   🏪 推荐: 阿里云、腾讯云、华为云\n');

    const choice = await this.askQuestion('🤔 您倾向于选择哪种方案？(输入数字1-4): ');
    await this.provideDetailedGuide(choice);
  }

  async provideDetailedGuide(choice) {
    switch(choice) {
      case '1':
        await this.showGitHubPagesGuide();
        break;
      case '2':
        await this.showNetlifyGuide();
        break;
      case '3':
        await this.showVercelGuide();
        break;
      case '4':
        await this.showDomainPurchaseGuide();
        break;
      default:
        console.log('\n💡 我推荐您选择方案2（Netlify），最简单快捷！');
        await this.showNetlifyGuide();
    }
  }

  async showGitHubPagesGuide() {
    console.log('\n📚 **GitHub Pages 详细步骤：**\n');
    console.log('1. 注册GitHub账号: https://github.com');
    console.log('2. 创建新仓库，命名如: music-concert');
    console.log('3. 上传项目文件到仓库');
    console.log('4. 仓库设置 → Pages → 选择分支');
    console.log('5. 获得域名: https://用户名.github.io/music-concert\n');
    console.log('📖 详细教程: https://docs.github.com/zh/pages');
  }

  async showNetlifyGuide() {
    console.log('\n📚 **Netlify 详细步骤：**\n');
    console.log('1. 访问 https://netlify.com');
    console.log('2. 点击 "Sign up" 注册账号');
    console.log('3. 进入控制台，点击 "Add new site"');
    console.log('4. 选择 "Deploy manually"');
    console.log('5. 将项目的 h5-dist 文件夹拖拽到页面');
    console.log('6. 自动获得域名: https://随机名称.netlify.app');
    console.log('7. 可以修改为自定义名称\n');
    console.log('✨ 优点: 拖拽上传，30秒完成部署！');
  }

  async showVercelGuide() {
    console.log('\n📚 **Vercel 详细步骤：**\n');
    console.log('1. 访问 https://vercel.com');
    console.log('2. 用GitHub账号登录');
    console.log('3. 点击 "New Project"');
    console.log('4. 导入GitHub仓库或上传文件');
    console.log('5. 自动部署，获得域名: https://项目名.vercel.app\n');
    console.log('✨ 优点: 部署速度极快，国外访问优秀！');
  }

  async showDomainPurchaseGuide() {
    console.log('\n📚 **购买域名+主机步骤：**\n');
    console.log('🏪 **推荐服务商：**');
    console.log('• 阿里云: https://www.aliyun.com');
    console.log('• 腾讯云: https://cloud.tencent.com');
    console.log('• 华为云: https://www.huaweicloud.com\n');
    
    console.log('📋 **购买清单：**');
    console.log('1. 域名: 如 musicconcert.com (约60元/年)');
    console.log('2. 虚拟主机: 支持HTTPS (约200元/年)');
    console.log('3. SSL证书: 现在大多免费提供\n');
    
    console.log('⏱️  **时间成本：** 1-2天（域名解析生效）');
    console.log('💰 **费用成本：** 约260元/年');
  }

  async suggestSolutions() {
    console.log('\n💡 **解决文件上传权限的方案：**\n');
    console.log('1. 联系您的网站管理员获取FTP权限');
    console.log('2. 使用网站后台的文件管理功能');
    console.log('3. 考虑使用免费的GitHub Pages或Netlify');
  }

  async generateNextSteps(domain) {
    const steps = `
📝 **您的部署信息确认**

✅ 域名: ${domain}
✅ AppID: 您已获取
✅ 上传权限: 已确认

🚀 **下一步操作：**

1. 运行部署脚本:
   ./scripts/one-click-deploy.sh

2. 按提示输入:
   - AppID: [您已有的AppID]
   - 域名: ${domain}

3. 上传文件到服务器根目录:
   - index.html
   - manifest.json
   - sw.js
   - 2025-10-02 18.03.32.jpg

4. 测试访问: ${domain}/index.html

💡 **提示:** 保存好这些信息，马上就要用到！
`;

    console.log(steps);
  }

  async run() {
    try {
      await this.checkCurrentSituation();
    } catch (error) {
      console.error('❌ 检查过程出错:', error.message);
    } finally {
      this.rl.close();
    }
  }
}

// 运行域名检查
if (require.main === module) {
  const checker = new DomainChecker();
  checker.run();
}

module.exports = DomainChecker;