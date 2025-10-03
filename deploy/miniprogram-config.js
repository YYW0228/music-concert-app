// 微信小程序部署配置 - 自动生成
module.exports = {
  // 微信小程序基本信息
  appId: 'wx63d06a67fb222cb8',
  privateKeyPath: './private.key',
  
  // H5页面部署域名
  webDomain: 'https://music-concert-app.pages.dev',
  
  // 小程序基本信息
  projectConfig: {
    appid: 'wx63d06a67fb222cb8',
    projectname: '营地主题音乐会',
    setting: {
      urlCheck: false,
      es6: true,
      enhance: true,
      postcss: true,
      preloadBackgroundData: false,
      minified: true,
      newFeature: false,
      coverView: true,
      nodeModules: false,
      autoAudits: false,
      showShadowRootInWxmlPanel: true,
      scopeDataCheck: false,
      checkInvalidKey: true,
      checkSiteMap: true,
      uploadWithSourceMap: true,
      compileHotReLoad: false,
      babelSetting: {
        ignore: [],
        disablePlugins: [],
        outputPath: ''
      },
      useIsolateContext: true,
      useCompilerModule: true,
      userConfirmedUseCompilerModuleSwitch: false
    },
    compileType: 'miniprogram',
    libVersion: '2.14.1',
    appid: 'wx63d06a67fb222cb8',
    projectname: '营地主题音乐会',
    debugOptions: {
      hidedInDevtools: []
    },
    scripts: {},
    isGameTourist: false,
    simulatorType: 'wechat',
    simulatorPluginLibVersion: {},
    condition: {
      search: { current: -1, list: [] },
      conversation: { current: -1, list: [] },
      game: { current: -1, list: [] },
      plugin: { current: -1, list: [] },
      gamePlugin: { current: -1, list: [] },
      miniprogram: { current: -1, list: [] }
    }
  },
  
  // 业务域名配置
  webviewDomains: [
    'https://music-concert-app.pages.dev'  // Cloudflare Pages 域名
  ],
  
  // 上传配置
  uploadConfig: {
    version: '1.0.0',
    desc: '营地主题音乐会首次发布',
    setting: {
      es6: true,
      minify: true,
      codeProtect: false,
      autoPrefixWXSS: true
    }
  }
};