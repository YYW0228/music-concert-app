// pages/index/index.js
Page({
  data: {
    concertInfo: {
      title: '营地主题音乐会',
      subtitle: '艾音艺术教育',
      date: '2025年10月',
      location: '营地音乐厅'
    }
  },

  onLoad: function (options) {
    console.log('首页加载');
    
    // 设置页面标题
    wx.setNavigationBarTitle({
      title: '营地主题音乐会'
    });
  },

  onShow: function () {
    console.log('首页显示');
  },

  // 跳转到音乐会页面
  goToConcert: function() {
    wx.switchTab({
      url: '/pages/webview/webview'
    });
  },

  // 分享功能
  onShareAppMessage: function () {
    return {
      title: '营地主题音乐会 - 艾音艺术教育',
      desc: '一场简约几何与色彩的交响，精彩节目等你来！',
      path: '/pages/index/index',
      imageUrl: '/images/share-cover.jpg'
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