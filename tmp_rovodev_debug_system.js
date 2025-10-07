#!/usr/bin/env node

const fs = require('fs');

class AudioDebugSystem {
  log(message, type = 'info') {
    const colors = { info: '\x1b[36m', success: '\x1b[32m', warning: '\x1b[33m', error: '\x1b[31m' };
    console.log(`${colors[type]}🔧 ${message}\x1b[0m`);
  }

  async createAdvancedDebugSystem() {
    this.log('创建高级音频调试系统...', 'info');

    let html = fs.readFileSync('index.html', 'utf8');

    // 添加高级调试系统
    const advancedDebugScript = `
    // 🔧 高级音频调试系统
    class AudioDebugger {
        constructor() {
            this.audio = document.getElementById('bg-music');
            this.debugInfo = [];
            this.setupDetailedLogging();
        }

        setupDetailedLogging() {
            if (!this.audio) {
                this.log('❌ CRITICAL: audio元素未找到!', 'error');
                return;
            }

            // 所有可能的音频事件
            const events = [
                'loadstart', 'durationchange', 'loadedmetadata', 'loadeddata',
                'progress', 'canplay', 'canplaythrough', 'play', 'playing',
                'pause', 'waiting', 'seeking', 'seeked', 'ended', 'error',
                'timeupdate', 'volumechange', 'ratechange', 'suspend', 'abort',
                'emptied', 'stalled'
            ];

            events.forEach(event => {
                this.audio.addEventListener(event, (e) => {
                    this.log(\`✅ 音频事件: \${event}\`, 'info');
                    if (event === 'error') {
                        this.debugError();
                    }
                    if (event === 'loadedmetadata') {
                        this.debugMetadata();
                    }
                    if (event === 'canplay') {
                        this.debugPlayability();
                    }
                });
            });

            // 定期状态检查
            setInterval(() => {
                this.debugCurrentState();
            }, 5000);
        }

        debugError() {
            const error = this.audio.error;
            if (error) {
                this.log(\`❌ 音频错误代码: \${error.code}\`, 'error');
                this.log(\`❌ 错误信息: \${error.message || '未知错误'}\`, 'error');
                
                const errorMessages = {
                    1: 'MEDIA_ERR_ABORTED - 用户中止',
                    2: 'MEDIA_ERR_NETWORK - 网络错误',  
                    3: 'MEDIA_ERR_DECODE - 解码错误',
                    4: 'MEDIA_ERR_SRC_NOT_SUPPORTED - 不支持的音频格式'
                };
                
                this.log(\`❌ 详细说明: \${errorMessages[error.code] || '未知错误类型'}\`, 'error');
            }
        }

        debugMetadata() {
            this.log(\`📊 音频时长: \${this.audio.duration} 秒\`, 'info');
            this.log(\`📊 当前源: \${this.audio.currentSrc}\`, 'info');
            this.log(\`📊 网络状态: \${this.audio.networkState}\`, 'info');
            this.log(\`📊 准备状态: \${this.audio.readyState}\`, 'info');
        }

        debugPlayability() {
            this.log(\`🎵 可播放状态确认\`, 'success');
            this.log(\`🎵 缓冲时间范围: \${this.getBufferedRanges()}\`, 'info');
        }

        debugCurrentState() {
            if (this.audio.paused) {
                this.log(\`⏸️ 当前状态: 暂停 (时间: \${this.audio.currentTime}s)\`, 'warning');
            } else {
                this.log(\`▶️ 当前状态: 播放中 (时间: \${this.audio.currentTime}s)\`, 'success');
            }
        }

        getBufferedRanges() {
            const buffered = this.audio.buffered;
            const ranges = [];
            for (let i = 0; i < buffered.length; i++) {
                ranges.push(\`[\${buffered.start(i).toFixed(1)}-\${buffered.end(i).toFixed(1)}]\`);
            }
            return ranges.join(', ') || '无缓冲';
        }

        log(message, type = 'info') {
            const colors = {
                info: 'color: #06b6d4',
                success: 'color: #10b981', 
                warning: 'color: #f59e0b',
                error: 'color: #ef4444'
            };
            console.log(\`%c\${message}\`, colors[type]);
            this.debugInfo.push({
                timestamp: new Date().toLocaleTimeString(),
                message: message,
                type: type
            });
        }

        manualTest() {
            this.log('🔧 手动测试开始...', 'info');
            
            if (this.audio.paused) {
                this.audio.play().then(() => {
                    this.log('✅ 手动播放成功!', 'success');
                }).catch(e => {
                    this.log(\`❌ 手动播放失败: \${e.message}\`, 'error');
                });
            } else {
                this.log('🎵 音频已在播放中', 'info');
            }
        }

        getDebugReport() {
            return {
                audioElement: !!this.audio,
                currentSrc: this.audio?.currentSrc,
                duration: this.audio?.duration,
                currentTime: this.audio?.currentTime,
                paused: this.audio?.paused,
                muted: this.audio?.muted,
                volume: this.audio?.volume,
                readyState: this.audio?.readyState,
                networkState: this.audio?.networkState,
                error: this.audio?.error,
                debugLog: this.debugInfo.slice(-10) // 最近10条日志
            };
        }
    }

    // 全局调试器
    window.audioDebugger = new AudioDebugger();

    // 添加手动测试按钮（开发时使用）
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const debugBtn = document.createElement('button');
        debugBtn.textContent = '🔧 音频调试';
        debugBtn.style.cssText = 'position:fixed;top:10px;right:10px;z-index:9999;padding:10px;background:#ef4444;color:white;border:none;border-radius:5px;cursor:pointer;';
        debugBtn.onclick = () => {
            window.audioDebugger.manualTest();
            console.log('📊 调试报告:', window.audioDebugger.getDebugReport());
        };
        document.body.appendChild(debugBtn);
    }`;

    // 在现有脚本后添加调试系统
    html = html.replace(
      '</script>\n    <div id="music-toggle">',
      advancedDebugScript + '\n    </script>\n    <div id="music-toggle">'
    );

    fs.writeFileSync('index.html', html);
    this.log('高级音频调试系统已添加', 'success');
  }

  async run() {
    console.log(`
🔧 创建高级音频调试系统

功能特性:
✅ 详细的音频事件日志
✅ 错误代码详细解释  
✅ 实时状态监控
✅ 手动测试功能
✅ 缓冲状态检查
✅ 调试报告生成

使用方法:
1. 打开浏览器开发者工具 (F12)
2. 查看控制台详细日志
3. 在控制台输入: audioDebugger.getDebugReport()
4. 获取完整的调试信息
`);

    await this.createAdvancedDebugSystem();

    console.log(`
🎵 《天空之城》钢琴曲 + 调试系统部署准备完成!

文件大小: 1.3MB 高质量音频
音乐: 久石让《天空之城》钢琴曲 - 助眠纯音乐钢琴独奏
调试: 全方位音频播放问题诊断系统
`);
  }
}

new AudioDebugSystem().run().catch(console.error);