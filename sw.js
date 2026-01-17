// Service Worker para Anotador de Truco
// Versión: 2.1.0

const CACHE_NAME = 'truco-laundry-v2.1.1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './assets/logo_laundry_truco.png',
  './assets/truco_laundry_logo.png',
  './assets/icon-44x44.png',
  './assets/icon-150x150.png',
  './assets/icon-310x310.png',
  './assets/favicon.ico',
  './assets/favicon-32x32.png',
  './assets/papafrita.svg',
  './assets/papafrita-horizontal.svg',
  './assets/papafrita1.svg',
  './assets/papafrita2.svg',
  './assets/papafrita3.svg',
  './assets/papafrita4.svg',
  './assets/papafrita5.svg',
  './assets/var.svg',
  './assets/restart.png',
  './assets/apple-touch-icon-152x152.png',
  './assets/apple-touch-icon-167x167.png',
  './assets/apple-touch-icon-180x180.png'
];

// Instalación: Cachear recursos
self.addEventListener('install', event => {
  console.log('[SW] Instalando Service Worker v' + CACHE_NAME);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Cacheando recursos');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        console.log('[SW] Recursos cacheados exitosamente');
        // Activar inmediatamente sin esperar
        return self.skipWaiting();
      })
      .catch(err => {
        console.error('[SW] Error al cachear recursos:', err);
      })
  );
});

// Activación: Limpiar caches antiguos
self.addEventListener('activate', event => {
  console.log('[SW] Activando Service Worker v' + CACHE_NAME);
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Eliminando cache antiguo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service Worker activado');
        // Tomar control inmediato de todas las páginas
        return self.clients.claim();
      })
  );
});

// Fetch: Estrategia Cache-First con Network Fallback
self.addEventListener('fetch', event => {
  // Ignorar requests de chrome-extension y otros protocolos no HTTP
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Recurso encontrado en cache
          return cachedResponse;
        }

        // No está en cache, buscar en la red
        return fetch(event.request)
          .then(networkResponse => {
            // Cachear la respuesta para futuras peticiones (solo GET)
            if (event.request.method === 'GET' && networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }
            return networkResponse;
          })
          .catch(error => {
            console.error('[SW] Error al obtener recurso:', error);
            // Si falla la red, mostrar página offline básica
            if (event.request.destination === 'document') {
              return caches.match('./index.html');
            }
            throw error;
          });
      })
  );
});

// Mensaje para notificar actualizaciones
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
