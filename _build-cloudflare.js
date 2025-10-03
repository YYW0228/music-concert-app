#!/usr/bin/env node

/**
 * Cloudflare Pages 专用构建脚本
 * 
 * 这个脚本专门为 Cloudflare Pages 的自动化部署环境设计
 * 会在 Cloudflare 服务器上执行，构建出 h5-dist 目录
 */

const fs = require('fs-extra');
const path = require('path');

async function buildForCloudflare() {
  try {
    console.log('🚀 Cloudflare Pages 构建开始...');

    const rootDir = process.cwd();
    const distDir = path.join(rootDir, 'h5-dist');

    // 1. 清理并创建输出目录
    if (await fs.pathExists(distDir)) {
      await fs.remove(distDir);
    }
    await fs.ensureDir(distDir);

    // 2. 复制 H5 文件
    const filesToCopy = [
      'index.html',
      'manifest.json', 
      'sw.js'
    ];

    for (const file of filesToCopy) {
      const srcPath = path.join(rootDir, file);
      const destPath = path.join(distDir, file);
      
      if (await fs.pathExists(srcPath)) {
        await fs.copy(srcPath, destPath);
        console.log(`✓ 复制 ${file}`);
      }
    }

    // 3. 复制资源目录
    const assetDirs = ['icons', 'static'];
    
    for (const dir of assetDirs) {
      const srcPath = path.join(rootDir, dir);
      const destPath = path.join(distDir, dir);
      
      if (await fs.pathExists(srcPath)) {
        await fs.copy(srcPath, destPath);
        console.log(`✓ 复制 ${dir}/`);
      }
    }

    // 4. 检查并复制其他资源文件
    console.log('✓ 资源文件复制完成');

    console.log('✅ Cloudflare Pages 构建完成!');
    console.log(`📁 输出目录: h5-dist`);

  } catch (error) {
    console.error('❌ 构建失败:', error.message);
    process.exit(1);
  }
}

buildForCloudflare();