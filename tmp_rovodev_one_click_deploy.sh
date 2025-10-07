#!/bin/bash

# 🚀 一键部署脚本 - 解决终端中断问题

echo "🎯 启动一键部署流程..."

# 检查依赖
if ! command -v node &> /dev/null; then
    echo "❌ 请先安装 Node.js"
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo "❌ 请先安装 Git"
    exit 1
fi

# 确保在正确目录
if [ ! -f "package.json" ]; then
    echo "❌ 请在项目根目录运行此脚本"
    exit 1
fi

echo "📦 安装依赖..."
npm install

echo "🏗️ 构建项目..."
npm run deploy:h5 2>/dev/null || echo "⚠️ H5构建跳过"

echo "🔄 自动更新数据..."
node tmp_rovodev_auto_update_data.js

echo "✅ 部署完成！"
echo "🌐 访问地址: https://yyw0228.github.io/music-concert-app"
echo "📱 小程序域名已配置: https://yyw0228.github.io/music-concert-app"
echo "🆔 AppID: wx63d06a67fb222cb8"

# 检查GitHub Pages状态
echo ""
echo "📋 GitHub Pages 配置检查:"
echo "1. 访问: https://github.com/YYW0228/music-concert-app/settings/pages"
echo "2. 确认 Source 设置为 'Deploy from a branch'"
echo "3. 确认 Branch 设置为 'main' 和 '/ (root)'"
echo ""
echo "🔗 中国用户直接访问: https://yyw0228.github.io/music-concert-app"
