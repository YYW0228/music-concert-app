# 🛠️ Cloudflare Pages 构建配置

## 构建设置

```
Project name: music-concert-app
Production branch: main
Framework preset: None
Build command: npm install && node _build-cloudflare.js
Build output directory: h5-dist
Root directory: (留空)
```

## 环境变量

不需要设置任何环境变量，直接点击 `Save and Deploy`

## 预期结果

- 第一次部署约需 2-5 分钟
- 成功后获得域名格式：`https://music-concert-app.pages.dev`
- 可在 `Deployments` 标签查看构建日志

## 构建成功标志

构建日志中应显示：
```
✓ 复制 index.html
✓ 复制 manifest.json  
✓ 复制 sw.js
✓ 复制 icons/
✓ 复制 static/
✓ 资源文件复制完成
✅ Cloudflare Pages 构建完成!
```