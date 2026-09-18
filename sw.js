const CACHE_NAME = 'catalogo-materiais-cache-v1';
const ASSETS = [
  './', 
  './index.html', 
  './dados.csv', 
  './manifest.json',
  './sw.js'
  // Adicione aqui outros arquivos estáticos se tiver (CSS, imagens de ícones etc.)
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cache aberto:', CACHE_NAME);
      return cache.addAll(ASSETS);
    }).catch(err => console.error('Erro ao adicionar assets ao cache:', err))
  );
  self.skipWaiting(); // Garante que o novo SW assuma o controle imediatamente
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Limpando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Garante que o SW recém-ativado controle todas as páginas
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      // Se encontrar no cache, retorna
      if (response) {
        return response;
      }
      // Senão, tenta buscar da rede
      return fetch(e.request).then(networkResponse => {
        // Se a requisição for bem sucedida, armazena no cache para uso futuro
        // (Pode ser útil para atualizações de dados, mas cuidado com dados que mudam frequentemente)
        // caches.put(e.request, networkResponse.clone()); 
        return networkResponse;
      }).catch(err => {
        console.error('Erro na rede e no cache:', err);
        // Retorna uma resposta genérica de erro se tudo falhar
        return new Response('Não foi possível carregar o recurso.', { status: 404, statusText: 'Not Found' });
      });
    })
  );
});
