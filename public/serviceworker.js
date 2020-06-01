const CACHE_NAME = "version-1"
const urlsToCache = ['index.html', 'offline.html']

const self = this;

// Instalar Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) =>{
                console.log('Cache Aberta')

                return cache.addAll(urlsToCache)
            })
    )
});

// Pegar as requisições
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(() => {
                return fetch(event.request)
                    .catch(() => caches.match('offline.html'))
            })
    )
});

// Ativar o Service Worker
self.addEventListener('activate', (event) => {
    const cacheWhiteList = []
    cacheWhiteList.push(CACHE_NAME)

    event.waitUntil(
        caches.keys()
        .then((cacheNames)=> Promise.all(
            cacheNames.map((cacheName) => {
                if(!cacheWhiteList.includes(cacheName)){
                    return caches.delete(cacheName)
                }
            })
        ))
    )
});