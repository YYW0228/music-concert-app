#!/bin/bash

# 营地主题音乐会一键部署脚本
echo "🎯 营地主题音乐会一键部署脚本"
echo "=================================="

# 检查Node.js环境
if ! command -v node &> /dev/null; then
    echo "❌ 未检测到Node.js，请先安装Node.js (https://nodejs.org/)"
    exit 1
fi

echo "✅ Node.js环境检查通过"

# 检查npm
if ! command -v npm &> /dev/null; then
    echo "❌ 未检测到npm，请检查Node.js安装"
    exit 1
fi

echo "✅ npm环境检查通过"

# 安装依赖
echo "📦 安装项目依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo "✅ 依赖安装完成"

# 运行配置向导
echo "⚙️  启动配置向导..."
npm run setup

echo "🎉 一键部署完成！"
echo ""
echo "📋 接下来请按照以下步骤完成部署："
echo "1. 将 h5-dist/ 目录下的文件上传到您的服务器"
echo "2. 在微信小程序后台配置业务域名"
echo "3. 使用微信开发者工具打开 dist/ 目录并上传"
echo ""
echo "📖 详细说明请查看: DEPLOY_GUIDE.md"