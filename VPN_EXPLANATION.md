# 🌐 VPN/代理对不同 Cloudflare 服务的影响

## 为什么 Zero Trust 可以访问，但 Pages 不行？

### 1. 不同的网络路由策略
- **Cloudflare Zero Trust**: 通常使用专用的网络通道和域名
- **Cloudflare Pages**: 使用标准的 CDN 网络和 `*.pages.dev` 域名

### 2. 代理软件的域名规则
很多代理软件（如 Clash）有默认规则：
- `*.pages.dev` 可能被列入代理列表
- Zero Trust 的域名可能在直连白名单中

### 3. SSL/TLS 证书处理
- 代理软件可能对某些域名有不同的证书验证策略
- Zero Trust 和 Pages 使用不同的证书配置

### 4. IP 地址池差异
- Cloudflare 的不同服务使用不同的 IP 地址池
- 代理软件可能对某些 IP 段有特殊处理

## 解决方案

### 为了稳定访问 Cloudflare Pages，可以：
1. **在代理软件中添加规则**:
   - 将 `*.pages.dev` 添加到直连列表
   - 或添加具体域名 `music-concert-app.pages.dev`

2. **使用自定义域名**:
   - 在 Cloudflare Pages 中绑定自己的域名
   - 避免使用 `*.pages.dev` 子域名

3. **调整代理规则**:
   - 检查代理软件的域名分流规则
   - 确保 Cloudflare 相关服务正常访问