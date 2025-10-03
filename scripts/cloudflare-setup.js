#!/usr/bin/env node

/**
 * Cloudflare Pages 一键配置脚本
 * 
 * 这个脚本会：
 * 1. 检查项目配置
 * 2. 引导用户完成 Cloudflare 配置
 * 3. 更新小程序配置文件
 * 4. 生成最终的小程序包
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');

class CloudflareSetup {
  constructor() {
    this.rootDir = path.join(__dirname, '..');
    this.configPath = path.join(this.rootDir, 'deploy', 'miniprogram-config.js');
  }

  async run() {
    try {
      console.log(chalk.blue.bold('\n🌐 Cloudflare Pages 配置向导\n'));
      
      await this.showInstructions();
      await this.getDomainFromUser();
      await this.updateConfig();
      await this.generateFinalBuild();
      await this.showNextSteps();

    } catch (error) {
      console.error(chalk.red('❌ 配置失败:'), error.message);
      process.exit(1);
    }
  }

  async showInstructions() {
    console.log(chalk.yellow('📋 开始之前，请确保您已经：'));
    console.log(chalk.gray('  1. 将代码推送到 GitHub'));
    console.log(chalk.gray('  2. 在 Cloudflare 创建了 Pages 项目'));
    console.log(chalk.gray('  3. 获得了 .pages.dev 域名\n'));

    const { ready } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'ready',
        message: '您是否已经完成了上述步骤？',
        default: false
      }
    ]);

    if (!ready) {
      console.log(chalk.cyan('\n📖 请先参考 CLOUDFLARE_DEPLOY_GUIDE.md 完成 Cloudflare 配置'));
      process.exit(0);
    }
  }

  async getDomainFromUser() {
    console.log(chalk.green('\n🔗 请输入您的 Cloudflare Pages 域名'));
    console.log(chalk.gray('例如: https://yinyuehui.pages.dev'));

    const { domain } = await inquirer.prompt([
      {
        type: 'input',
        name: 'domain',
        message: 'Cloudflare 域名:',
        validate: (input) => {
          if (!input) return '请输入域名';
          if (!input.startsWith('https://')) return '域名必须以 https:// 开头';
          if (!input.includes('.pages.dev')) return '请输入 Cloudflare Pages 域名 (.pages.dev)';
          return true;
        }
      }
    ]);

    this.cloudflareUrl = domain.trim().replace(/\/$/, ''); // 移除末尾的斜杠
    console.log(chalk.green(`✓ 确认域名: ${this.cloudflareUrl}`));
  }

  async updateConfig() {
    console.log(chalk.blue('\n📝 更新配置文件...'));

    // 读取配置文件
    const configContent = await fs.readFile(this.configPath, 'utf8');
    
    // 替换域名配置
    let updatedConfig = configContent
      .replace(/webDomain:\s*['"`][^'"`]*['"`]/, `webDomain: '${this.cloudflareUrl}'`)
      .replace(/webviewDomains:\s*\[[\s\S]*?\]/, `webviewDomains: [\n    '${this.cloudflareUrl}'\n  ]`);

    // 写回文件
    await fs.writeFile(this.configPath, updatedConfig);
    
    console.log(chalk.green('✓ 配置文件已更新'));
  }

  async generateFinalBuild() {
    console.log(chalk.blue('\n🏗️ 生成最终小程序包...'));

    try {
      // 运行部署脚本
      const { spawn } = require('child_process');
      
      await new Promise((resolve, reject) => {
        const child = spawn('npm', ['run', 'deploy:miniprogram'], {
          cwd: this.rootDir,
          stdio: 'inherit'
        });

        child.on('close', (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`构建失败，退出代码: ${code}`));
          }
        });
      });

      console.log(chalk.green('✓ 小程序包生成完成'));

    } catch (error) {
      throw new Error(`构建失败: ${error.message}`);
    }
  }

  async showNextSteps() {
    console.log(chalk.green.bold('\n🎉 配置完成！\n'));
    
    console.log(chalk.yellow('📱 接下来请在微信开发者工具中：'));
    console.log(chalk.gray('  1. 导入项目 (选择 dist 目录)'));
    console.log(chalk.gray('  2. 点击预览，扫码测试'));
    console.log(chalk.gray('  3. 确认页面正常加载'));
    console.log(chalk.gray('  4. 点击上传，提交审核\n'));

    console.log(chalk.cyan('🔍 如果遇到问题：'));
    console.log(chalk.gray('  - 检查微信公众平台的业务域名配置'));
    console.log(chalk.gray('  - 确保校验文件已上传到 Cloudflare'));
    console.log(chalk.gray('  - 查看开发者工具的网络请求日志\n'));

    console.log(chalk.blue(`🌐 您的 H5 页面地址: ${this.cloudflareUrl}`));
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  const setup = new CloudflareSetup();
  setup.run().catch(error => {
    console.error(chalk.red('Setup failed:'), error);
    process.exit(1);
  });
}

module.exports = CloudflareSetup;