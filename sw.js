const CACHE = 'catalogo-v4';
const arquivos = ['./index.html', './manifest.json', './dados.csv'];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE).then(cache => cache.addAll(arquivos))
        .then(() => self.skipWaiting())
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(res => res || fetch(e.request))
    );
});