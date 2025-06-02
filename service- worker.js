const CACHE_NAME = 'jade-resonance-cache-v1';

// 从 jadeData.json 中提取的图片资源
const jadeDataImages = [
    'assets/images/characters/hetian.png',
    'assets/images/characters/lantian.png',
    'assets/images/characters/dushan.png',
    'assets/images/characters/xiuyu.png',
    'assets/images/characters/shoushan.png',
    'assets/images/characters/qingtian.png',
    'assets/images/characters/changhua.png',
    'assets/images/characters/balin.png',
    'assets/images/jades/hetian.png',
    'assets/images/jades/lantian.png',
    'assets/images/jades/dushan.png',
    'assets/images/jades/xiuyu.png',
    'assets/images/jades/shoushan.png',
    'assets/images/jades/qingtian.png',
    'assets/images/jades/changhua.png',
    'assets/images/jades/balin.png'
];

// 其他图片资源
const additionalImages = [
    'assets/images/loading.png',
    'assets/images/玉器工坊.png',
    'assets/images/玉石拟人.png',
    'assets/images/玉石展示.png',
    'assets/images/background/bgForSelect.png',
    'assets/images/background/museum-bg.jpg',
    'assets/images/background.jpg'
];

// 合并所有需要缓存的图片资源
const resourcesToCache = [...jadeDataImages, ...additionalImages];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Caching resources...');
            return cache.addAll(resourcesToCache);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            // 如果缓存中有匹配的资源，则返回缓存；否则从网络获取
            return response || fetch(event.request);
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});