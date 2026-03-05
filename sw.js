const CACHE_NAME = 'jupiter-v3'; // Súbelo a v3 ahora para forzar el cambio
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Instalación: descarga los archivos nuevos
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting()) // Obliga al SW a activarse ya mismo
  );
});

// Activación: BORRA los cachés viejos (v1, v2, etc.)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) // Toma el control de la página inmediatamente
  );
});

// Estrategia de respuesta
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
