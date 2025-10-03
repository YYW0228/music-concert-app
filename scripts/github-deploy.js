#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

class GitHubDeployHelper {
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

  async run() {
    console.log('🎯 GitHub Pages 部署助手');
    console.log('专为中国用户优化的域名获取方案\n');

    const hasGitHub = await this.askQuestion('❓ 您是否已有GitHub账号？(y/n): ');

    if (hasGitHub.toLowerCase() === 'n' || hasGitHub.toLowerCase() === 'no') {
      await this.showRegistrationGuide();
    } else {
      await this.showDeploymentGuide();
    }

    this.rl.close();
  }

  async showRegistrationGuide() {
    console.log('\n📝 **GitHub账号注册指南：**\n');
    
    console.log('1. 访问：https://github.com');
    console.log('2. 点击右上角 "Sign up"');
    console.log('3. 填写注册信息：');
    console.log('   • 用户名（建议用英文，将成为域名一部分）');
    console.log('   • 邮箱地址');
    console.log('   • 密码\n');

    const suggestedUsername = await this.askQuestion('💡 您希望的用户名是什么？(用英文): ');
    
    if (suggestedUsername) {
      console.log(`\n✅ 很好！如果用户名是 "${suggestedUsername}"`);
      console.log(`   您的域名将是：https://${suggestedUsername}.github.io/music-concert\n`);
    }

    console.log('注册完成后，请重新运行此脚本选择"y"继续部署指导。');
  }

  async showDeploymentGuide() {
    console.log('\n🚀 **GitHub Pages 部署步骤：**\n');

    const username = await this.askQuestion('👤 您的GitHub用户名是：');
    const repoName = await this.askQuestion('📁 仓库名称（建议: music-concert）：') || 'music-concert';

    const finalDomain = `https://${username}.github.io/${repoName}`;

    console.log('\n📋 **详细操作步骤：**\n');

    console.log('**第1步：创建仓库**');
    console.log(`1. 访问：https://github.com/${username}`);
    console.log('2. 点击 "Repositories" → "New"');
    console.log(`3. Repository name: ${repoName}`);
    console.log('4. 选择 "Public"');
    console.log('5. 勾选 "Add a README file"');
    console.log('6. 点击 "Create repository"\n');

    console.log('**第2步：上传文件**');
    console.log('1. 在仓库页面点击 "uploading an existing file"');
    console.log('2. 上传以下文件：');
    console.log('   • index.html');
    console.log('   • manifest.json');
    console.log('   • sw.js');
    console.log('   • 2025-10-02 18.03.32.jpg');
    console.log('3. 填写提交信息："Upload music concert files"');
    console.log('4. 点击 "Commit changes"\n');

    console.log('**第3步：开启GitHub Pages**');
    console.log('1. 点击仓库顶部 "Settings"');
    console.log('2. 左侧菜单找到 "Pages"');
    console.log('3. Source 选择 "Deploy from a branch"');
    console.log('4. Branch 选择 "main"');
    console.log('5. 点击 "Save"\n');

    console.log('**第4步：获取域名**');
    console.log(`等待2-3分钟后，您的网站将在以下地址可用：`);
    console.log(`🌐 ${finalDomain}\n`);

    console.log('**第5步：验证部署**');
    console.log(`1. 访问：${finalDomain}`);
    console.log('2. 确认页面正常显示');
    console.log('3. 测试音乐播放功能\n');

    // 生成下一步操作指南
    await this.generateNextStepsFile(username, repoName, finalDomain);

    console.log('✅ **准备好部署小程序了吗？**');
    const readyToDeploy = await this.askQuestion('输入"y"开始小程序部署配置：');

    if (readyToDeploy.toLowerCase() === 'y') {
      console.log('\n🚀 启动小程序部署向导...\n');
      await this.startMiniprogramDeploy(finalDomain);
    }
  }

  async generateNextStepsFile(username, repoName, domain) {
    const content = `# 🎯 您的GitHub部署信息

## 📋 基本信息
- **GitHub用户名**: ${username}
- **仓库名称**: ${repoName}
- **网站域名**: ${domain}
- **仓库地址**: https://github.com/${username}/${repoName}

## 🔗 重要链接
- **网站访问**: ${domain}
- **仓库管理**: https://github.com/${username}/${repoName}
- **Pages设置**: https://github.com/${username}/${repoName}/settings/pages

## 📝 文件上传清单
请确保以下文件已上传到仓库根目录：
- [ ] index.html
- [ ] manifest.json
- [ ] sw.js
- [ ] 2025-10-02 18.03.32.jpg

## 🚀 小程序部署
使用以下信息部署小程序：
- **域名**: ${domain}
- **AppID**: [您的微信小程序AppID]

运行命令：
\`\`\`bash
./scripts/one-click-deploy.sh
\`\`\`

## 🔄 更新网站
如需更新网站内容：
1. 访问仓库：https://github.com/${username}/${repoName}
2. 点击要修改的文件
3. 点击编辑按钮（铅笔图标）
4. 修改后点击 "Commit changes"
5. 等待1-2分钟自动更新

## 📞 技术支持
如遇问题，请保存此文件并联系技术支持团队。
`;

    fs.writeFileSync('MY_GITHUB_INFO.md', content);
    console.log('📝 部署信息已保存到: MY_GITHUB_INFO.md');
  }

  async startMiniprogramDeploy(domain) {
    // 更新配置文件中的域名
    const configPath = './deploy/miniprogram-config.js';
    
    if (fs.existsSync(configPath)) {
      let config = fs.readFileSync(configPath, 'utf8');
      config = config.replace('https://your-domain.com', domain);
      fs.writeFileSync(configPath, config);
      console.log('⚙️ 已自动更新配置文件中的域名');
    }

    console.log('\n📱 **小程序部署准备完成！**');
    console.log(`✅ 域名已设置为: ${domain}`);
    console.log('\n请继续运行：');
    console.log('```bash');
    console.log('npm run deploy');
    console.log('```');
  }
}

// 运行GitHub部署助手
if (require.main === module) {
  const helper = new GitHubDeployHelper();
  helper.run().catch(console.error);
}

module.exports = GitHubDeployHelper;