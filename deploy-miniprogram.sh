#!/bin/bash

# 营地主题音乐会 - 微信开发者工具部署脚本
echo "🚀 开始部署营地主题音乐会..."

# 1. 运行构建
echo "📦 构建项目..."
npm run deploy

# 2. 打开微信开发者工具
echo "🔧 打开微信开发者工具..."
open "/Volumes/微信开发者工具 Stable ARM64/Applications/wechatwebdevtools.app"

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
