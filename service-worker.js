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
    'assets/images/background.png',
    'assets/images/background/bgForSelect.png',
    'assets/images/background/museum-bg.jpg',
    'assets/images/background.png'
];

const iconImages = [
    'assets/icons/plant24.jpg',
    'assets/icons/character14.jpg',
    'assets/icons/mountain.jpg',
    'assets/icons/玉字/甲骨文.jpg',
    'assets/icons/玉字/楷书.jpg',
    'assets/icons/玉字/隶书.jpg',
    'assets/icons/玉字/瘦金.jpg',
    'assets/icons/玉字/新石器.jpg',
    'assets/icons/玉字/行书.jpg',
    'assets/icons/玉字/篆书.jpg'
];

const jadeMuseumImages = [
    'assets/jades/翠玉白菜.jpg',
    'assets/jades/大禹治水图玉山.jpg',
    'assets/jades/妇好墓玉凤.jpg',
    'assets/jades/金缕玉衣.jpg',
    'assets/jades/金托玉爵.jpg',
    'assets/jades/晋侯墓组玉佩.jpg',
    'assets/jades/青玉飞天佩.jpg',
    'assets/jades/青玉云龙纹炉.jpg',
    'assets/jades/神人兽面纹玉琮.jpg',
    'assets/jades/宜子孙玉璧.jpg',
    'assets/jades/玉孔雀衔花饰.jpg',
    'assets/jades/玉梁金筐宝钿真珠装蹀躞带.jpg',
    'assets/jades/子冈款青玉合卺杯.jpg',
    'assets/jades/C形玉龙.jpg',
];

// 合并所有需要缓存的图片资源
const resourcesToCache = [...jadeDataImages, ...additionalImages,...iconImages];

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