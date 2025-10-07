#!/usr/bin/env node

/**
 * 🎵 底层音频架构重构
 * 基于状态机的音频管理系统
 */

class AudioArchitect {
  constructor() {
    this.logLevel = 'DEBUG';
  }

  log(message, level = 'INFO') {
    if (level === 'DEBUG' && this.logLevel === 'DEBUG') {
      console.log(`🔧 [AudioArch] ${message}`);
    }
  }

  /**
   * 重构音频底层逻辑
   * 1. 状态机管理
   * 2. 生命周期控制
   * 3. 错误恢复机制
   */
  generateNewAudioLogic() {
    return `
    <!-- 🎵 重构后的音频架构 -->
    <audio id="bg-audio" style="display: none;">
        <source src="./static/audio/castle-in-the-sky.mp3" type="audio/mpeg">
    </audio>

    <script>
        /**
         * 🎵 AudioCore - 底层音频状态机
         * 基于Linux内核设备驱动设计模式
         */
        class AudioCore {
            constructor(elementId) {
                this.element = document.getElementById(elementId);
                this.state = 'UNINITIALIZED';
                this.config = {
                    volume: 0.6,
                    loop: true,
                    autoRetry: true,
                    maxRetries: 3
                };
                this.retryCount = 0;
                this.eventHandlers = new Map();
                
                this.log('AudioCore initialized');
                this.initializeStateMachine();
            }

            log(message) {
                console.log(\`🎵 [AudioCore] \${message}\`);
            }

            /**
             * 状态机转换逻辑
             */
            initializeStateMachine() {
                if (!this.element) {
                    this.setState('ERROR', 'Audio element not found');
                    return;
                }

                // 绑定原生音频事件
                this.element.addEventListener('loadstart', () => this.onLoadStart());
                this.element.addEventListener('loadedmetadata', () => this.onMetadataLoaded());
                this.element.addEventListener('canplay', () => this.onCanPlay());
                this.element.addEventListener('playing', () => this.onPlaying());
                this.element.addEventListener('ended', () => this.onEnded());
                this.element.addEventListener('error', (e) => this.onError(e));
                this.element.addEventListener('stalled', () => this.onStalled());

                this.setState('INITIALIZED');
            }

            setState(newState, reason = '') {
                const oldState = this.state;
                this.state = newState;
                this.log(\`State: \${oldState} -> \${newState} \${reason ? '(' + reason + ')' : ''}\`);
                
                // 状态变化回调
                if (this.eventHandlers.has(newState)) {
                    this.eventHandlers.get(newState)();
                }
            }

            onLoadStart() {
                this.setState('LOADING');
            }

            onMetadataLoaded() {
                this.setState('METADATA_LOADED');
                this.log(\`Duration: \${this.element.duration}s\`);
                
                // 验证音频时长
                if (this.element.duration < 10) {
                    this.setState('ERROR', 'Audio too short, possible file corruption');
                    return;
                }
            }

            onCanPlay() {
                this.setState('READY');
                this.log('Audio ready for playback');
            }

            onPlaying() {
                this.setState('PLAYING');
                this.retryCount = 0; // 重置重试计数
            }

            onEnded() {
                this.setState('ENDED');
                if (this.config.loop) {
                    this.log('Looping audio');
                    this.play();
                }
            }

            onError(event) {
                const error = this.element.error;
                let errorMsg = 'Unknown error';
                
                if (error) {
                    const errorTypes = {
                        1: 'MEDIA_ERR_ABORTED',
                        2: 'MEDIA_ERR_NETWORK', 
                        3: 'MEDIA_ERR_DECODE',
                        4: 'MEDIA_ERR_SRC_NOT_SUPPORTED'
                    };
                    errorMsg = errorTypes[error.code] || \`Error code: \${error.code}\`;
                }

                this.setState('ERROR', errorMsg);
                
                // 自动重试机制
                if (this.config.autoRetry && this.retryCount < this.config.maxRetries) {
                    this.retryCount++;
                    this.log(\`Retrying... (\${this.retryCount}/\${this.config.maxRetries})\`);
                    setTimeout(() => this.load(), 1000 * this.retryCount);
                }
            }

            onStalled() {
                this.log('Audio stalled, checking network');
                this.setState('STALLED');
            }

            /**
             * 公共API
             */
            load() {
                this.setState('LOADING');
                this.element.load();
            }

            async play() {
                if (this.state === 'ERROR') {
                    this.log('Cannot play: in error state');
                    return false;
                }

                try {
                    this.element.volume = this.config.volume;
                    this.element.loop = this.config.loop;
                    
                    await this.element.play();
                    return true;
                } catch (error) {
                    this.log(\`Play failed: \${error.message}\`);
                    this.setState('ERROR', error.message);
                    return false;
                }
            }

            pause() {
                this.element.pause();
                this.setState('PAUSED');
            }

            getStatus() {
                return {
                    state: this.state,
                    currentTime: this.element.currentTime,
                    duration: this.element.duration,
                    volume: this.element.volume,
                    loop: this.element.loop,
                    retryCount: this.retryCount,
                    src: this.element.currentSrc
                };
            }
        }

        /**
         * 🎵 全局音频管理器
         */
        window.AudioManager = {
            core: null,
            userActivated: false,

            init() {
                this.core = new AudioCore('bg-audio');
                
                // 等待用户交互
                this.setupUserActivation();
                
                // 调试接口
                window.audioDebug = () => {
                    console.table(this.core.getStatus());
                };
            },

            setupUserActivation() {
                const activateAudio = async () => {
                    if (this.userActivated) return;
                    
                    this.userActivated = true;
                    console.log('🎵 User activated, starting audio...');
                    
                    const success = await this.core.play();
                    if (success) {
                        console.log('🎵 Background music started successfully');
                    }
                };

                // 监听多种用户交互
                ['click', 'touchstart', 'keydown'].forEach(event => {
                    document.addEventListener(event, activateAudio, { once: true });
                });
            }
        };

        // 页面加载完成后初始化
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                AudioManager.init();
            });
        } else {
            AudioManager.init();
        }

        // 调试信息
        console.log('🎵 Audio architecture loaded. Use audioDebug() for status.');
    </script>`;
  }

  async run() {
    console.log(`
🎵 音频底层架构重构方案

核心设计理念:
1. 状态机管理 - 明确的状态转换
2. 错误恢复 - 自动重试机制  
3. 生命周期 - 完整的事件处理
4. 调试接口 - 实时状态监控

底层逻辑改进:
- 音频不再是简单的播放/暂停
- 而是一个有状态的设备驱动程序
- 支持错误恢复和自动重试
- 提供完整的调试信息
`);

    const newLogic = this.generateNewAudioLogic();
    console.log('\n🔧 新的音频架构代码已生成');
    console.log('📋 特性: 状态机 + 错误恢复 + 调试接口');
    
    return newLogic;
  }
}

new AudioArchitect().run().catch(console.error);