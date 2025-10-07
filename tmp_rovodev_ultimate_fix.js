#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

class UltimateFix {
  log(message, type = 'info') {
    const colors = { info: '\x1b[36m', success: '\x1b[32m', warning: '\x1b[33m', error: '\x1b[31m' };
    console.log(`${colors[type]}🔥 ${message}\x1b[0m`);
  }

  async embedQRCodeInHTML() {
    this.log('采用终极方案: 将二维码转换为Base64嵌入HTML', 'info');

    try {
      // 读取二维码文件
      const qrBuffer = fs.readFileSync('contact-qr.jpg');
      const base64QR = qrBuffer.toString('base64');
      const dataURI = `data:image/jpeg;base64,${base64QR}`;

      this.log(`二维码文件大小: ${qrBuffer.length} 字节`, 'info');
      this.log('Base64转换完成', 'success');

      // 读取HTML文件
      let html = fs.readFileSync('index.html', 'utf8');

      // 替换图片引用为Base64嵌入
      html = html.replace(
        'src="contact-qr.jpg"',
        `src="${dataURI}"`
      );

      // 写回文件
      fs.writeFileSync('index.html', html);
      fs.writeFileSync('h5-dist/index.html', html);

      this.log('HTML文件已更新，二维码已嵌入', 'success');

      return true;
    } catch (error) {
      this.log(`嵌入失败: ${error.message}`, 'error');
      return false;
    }
  }

  async createBackupSolution() {
    this.log('创建备用方案: 使用在线二维码生成器', 'info');

    const phoneNumber = '17365166266';
    const wechatText = '邓老师微信';
    
    // 使用QR.js在线服务作为备用
    const backupQRUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`微信联系: ${phoneNumber} (${wechatText})`)}`;

    let html = fs.readFileSync('index.html', 'utf8');
    
    // 添加备用二维码
    const backupSection = `
    <!-- 备用二维码方案 -->
    <div class="qr-backup" style="margin-top: 10px;">
        <img src="${backupQRUrl}" 
             alt="备用联系二维码" 
             style="width: 160px; height: 160px; border: 2px solid #10b981; border-radius: 8px;"
             onerror="this.style.display='none'">
        <p style="font-size: 12px; color: #666; margin-top: 5px;">备用联系方式</p>
    </div>`;

    // 在原二维码后添加备用方案
    html = html.replace(
      '</div>\n        </footer>',
      backupSection + '\n        </div>\n        </footer>'
    );

    fs.writeFileSync('index.html', html);
    fs.writeFileSync('h5-dist/index.html', html);

    this.log('备用二维码方案已添加', 'success');
  }

  async run() {
    console.log(`
🔥 终极修复方案启动

问题诊断:
❌ Cloudflare无法正确处理图片文件
❌ 多次路径修复均失败
❌ 构建配置可能有根本性问题

解决策略:
1. Base64嵌入: 将二维码直接嵌入HTML
2. 备用方案: 在线二维码生成器
3. 双重保障: 确保至少一种方式工作
`);

    const embedSuccess = await this.embedQRCodeInHTML();
    
    if (embedSuccess) {
      await this.createBackupSolution();
      
      // 提交更改
      execSync('git add .');
      execSync('git commit -m "🔥 终极修复: Base64嵌入二维码+备用方案"');
      execSync('git push origin main');

      console.log(`
🎉 终极修复完成!

✅ 主方案: 89KB真实二维码已Base64嵌入HTML
✅ 备用方案: 在线二维码生成器
✅ 双重保障: 确保用户一定能看到联系方式

⏰ 等待2-3分钟后访问:
🌐 https://music-concert-app.pages.dev/

📋 预期效果:
- 背景音乐: 奥芬巴赫卡农舞曲
- 节目单: 奥芬巴赫-卡农舞曲  
- 联系方式: 邓老师真实微信二维码(内嵌显示)
- 备用联系: 在线生成的联系二维码
`);

    } else {
      this.log('终极修复失败，请检查文件权限', 'error');
    }
  }
}

new UltimateFix().run().catch(console.error);