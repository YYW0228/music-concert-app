// 营地主题音乐会 Service Worker
const CACHE_NAME = 'camp-concert-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/2025-10-02 18.03.32.jpg'
  // 移除了不存在的外部资源引用
];

// 安装事件 - 缓存资源
self.addEventListener('install', event => {
  console.log('Service Worker 安装中...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('缓存已打开');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('缓存失败:', error);
      })
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', event => {
  console.log('Service Worker 激活中...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// 拦截请求 - 缓存优先策略
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果在缓存中找到资源，直接返回
        if (response) {
          return response;
        }
        
        // 否则从网络获取
        return fetch(event.request).then(response => {
          // 检查是否是有效响应
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // 克隆响应，因为响应是流，只能使用一次
          const responseToCache = response.clone();
          
          // 将新资源添加到缓存
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        }).catch(() => {
          // 网络请求失败时，对于HTML页面返回离线页面
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
      })
  );
});

// 消息处理 - 用于手动更新缓存
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// 后台同步 - 当网络恢复时同步数据
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log('后台同步触发');
    event.waitUntil(
      // 这里可以添加需要同步的逻辑
      Promise.resolve()
    );
  }
});

// 推送通知支持
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : '营地音乐会即将开始！',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: 'camp-concert',
    actions: [
      {
        action: 'view',
        title: '查看节目单',
        icon: '/icons/icon-72x72.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('营地主题音乐会', options)
  );
});

// 通知点击处理
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});