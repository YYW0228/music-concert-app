#!/usr/bin/env node

/**
 * H5页面构建脚本 - 专门用于Cloudflare Pages部署
 * 
 * 这个脚本会：
 * 1. 复制根目录的 H5 文件到 h5-dist 目录
 * 2. 确保所有静态资源路径正确
 * 3. 为 Cloudflare Pages 优化文件结构
 */

const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

class H5Builder {
  constructor() {
    this.rootDir = path.join(__dirname, '..');
    this.distDir = path.join(this.rootDir, 'h5-dist');
  }

  async build() {
    try {
      console.log(chalk.blue('🚀 开始构建 H5 页面...'));

      // 1. 清理并创建输出目录
      await this.cleanAndCreateDist();

      // 2. 复制 H5 文件
      await this.copyH5Files();

      // 3. 复制静态资源
      await this.copyStaticAssets();

      // 4. 验证构建结果
      await this.validateBuild();

      console.log(chalk.green('✅ H5 页面构建完成！'));
      console.log(chalk.cyan(`📁 输出目录: ${this.distDir}`));
      console.log(chalk.yellow('🌐 现在可以将 h5-dist 目录部署到 Cloudflare Pages'));

    } catch (error) {
      console.error(chalk.red('❌ H5 构建失败:'), error.message);
      process.exit(1);
    }
  }

  async cleanAndCreateDist() {
    console.log(chalk.gray('清理输出目录...'));
    
    // 删除现有的 dist 目录
    if (await fs.pathExists(this.distDir)) {
      await fs.remove(this.distDir);
    }
    
    // 创建新的 dist 目录
    await fs.ensureDir(this.distDir);
  }

  async copyH5Files() {
    console.log(chalk.gray('复制 H5 文件...'));
    
    const filesToCopy = [
      'index.html',
      'manifest.json',
      'sw.js'
    ];

    for (const file of filesToCopy) {
      const srcPath = path.join(this.rootDir, file);
      const destPath = path.join(this.distDir, file);
      
      if (await fs.pathExists(srcPath)) {
        await fs.copy(srcPath, destPath);
        console.log(chalk.gray(`  ✓ ${file}`));
      } else {
        console.log(chalk.yellow(`  ⚠ ${file} 不存在，跳过`));
      }
    }
  }

  async copyStaticAssets() {
    console.log(chalk.gray('复制静态资源...'));
    
    const assetDirs = ['icons', 'static', 'images'];
    
    for (const dir of assetDirs) {
      const srcPath = path.join(this.rootDir, dir);
      const destPath = path.join(this.distDir, dir);
      
      if (await fs.pathExists(srcPath)) {
        await fs.copy(srcPath, destPath);
        console.log(chalk.gray(`  ✓ ${dir}/`));
      }
    }

    // 复制其他可能的资源文件
    const additionalFiles = [
      '2025-10-02 18.03.32.jpg' // 根据你的项目结构
    ];

    for (const file of additionalFiles) {
      const srcPath = path.join(this.rootDir, file);
      const destPath = path.join(this.distDir, file);
      
      if (await fs.pathExists(srcPath)) {
        await fs.copy(srcPath, destPath);
        console.log(chalk.gray(`  ✓ ${file}`));
      }
    }
  }

  async validateBuild() {
    console.log(chalk.gray('验证构建结果...'));
    
    const requiredFiles = ['index.html'];
    
    for (const file of requiredFiles) {
      const filePath = path.join(this.distDir, file);
      if (!(await fs.pathExists(filePath))) {
        throw new Error(`必需文件 ${file} 不存在`);
      }
    }

    // 检查 index.html 内容
    const indexPath = path.join(this.distDir, 'index.html');
    const indexContent = await fs.readFile(indexPath, 'utf8');
    
    if (!indexContent.includes('营地主题音乐会')) {
      console.log(chalk.yellow('⚠ index.html 可能没有正确的内容'));
    }

    console.log(chalk.green('✓ 构建验证通过'));
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  const builder = new H5Builder();
  builder.build().catch(error => {
    console.error(chalk.red('构建失败:'), error);
    process.exit(1);
  });
}

module.exports = H5Builder;