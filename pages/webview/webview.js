// pages/webview/webview.js
Page({
  data: {
    webUrl: 'https://your-domain.com/index.html', // 实际部署的HTTPS域名
    loading: true
  },

  onLoad: function (options) {
    console.log('WebView页面加载');
    
    // 如果通过参数传递了URL，使用传递的URL
    if (options.url) {
      this.setData({
        webUrl: decodeURIComponent(options.url)
      });
    }
    
    // 设置页面标题
    wx.setNavigationBarTitle({
      title: '营地主题音乐会'
    });
    
    // 设置状态栏样式
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#3FA796'
    });
  },

  onShow: function () {
    console.log('WebView页面显示');
  },

  onHide: function () {
    console.log('WebView页面隐藏');
  },

  onUnload: function () {
    console.log('WebView页面卸载');
  },

  // WebView加载完成
  onWebViewLoad: function (e) {
    console.log('WebView加载完成', e);
    this.setData({
      loading: false
    });
  },

  
  // WebView加载错误 - 增强版
  onWebViewError: function (e) {
    console.error('WebView加载错误', e);
    this.setData({
      loading: false
    });
    
    // 显示详细错误信息
    wx.showModal({
      title: '页面加载失败',
      content: '网络连接异常，请检查网络后重试',
      showCancel: true,
      cancelText: '返回',
      confirmText: '重试',
      success: (res) => {
        if (res.confirm) {
          // 重新加载
          this.setData({ loading: true });
        } else {
          // 返回首页
          wx.switchTab({
            url: '/pages/index/index'
          });
        }
      }
    });
  },

  // 接收WebView消息
  onWebViewMessage: function (e) {
    console.log('收到WebView消息', e.detail.data);
    
    // 处理来自H5页面的消息
    const data = e.detail.data[0];
    if (data) {
      switch (data.type) {
        case 'share':
          this.handleShare(data);
          break;
        case 'navigate':
          this.handleNavigate(data);
          break;
        case 'music_control':
          this.handleMusicControl(data);
          break;
        default:
          console.log('未知消息类型', data);
      }
    }
  },

  // 处理分享
  handleShare: function (data) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  // 处理导航
  handleNavigate: function (data) {
    if (data.url) {
      wx.navigateTo({
        url: data.url
      });
    }
  },

  // 处理音乐控制
  handleMusicControl: function (data) {
    console.log('音乐控制', data);
    // 这里可以添加音乐控制相关的小程序逻辑
  },

  // 页面分享配置
  onShareAppMessage: function () {
    return {
      title: '营地主题音乐会 - 艾音艺术教育',
      desc: '一场简约几何与色彩的交响，精彩节目等你来！',
      path: '/pages/webview/webview',
      imageUrl: '/images/share-cover.jpg' // 分享封面图
    };
  },

  // 分享到朋友圈
  onShareTimeline: function () {
    return {
      title: '营地主题音乐会 - 艾音艺术教育',
      imageUrl: '/images/share-cover.jpg'
    };
  }
});