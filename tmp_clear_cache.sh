
echo "🔥 强制刷新Cloudflare Pages缓存..."

# 方法1: 添加时间戳强制更新
TIMESTAMP=$(date +%s)
echo "<!-- Cache-bust: $TIMESTAMP -->" >> index.html

# 方法2: 触发重新部署
git add .
git commit -m "🔥 强制刷新: 清除CDN缓存 - $TIMESTAMP" || true
git push origin main

echo "✅ 缓存清除完成，等待1-2分钟生效"
