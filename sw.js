const CACHE_NAME = 'jupiter-v4'; // Sube a v4 para invalidar todo lo anterior
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './imagenes/logo-app.png' // Agregamos el logo al precaché
];

// Instalación
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting()) 
  );
});

// Activación: Borra absolutamente todo lo viejo
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
    }).then(() => self.clients.claim()) 
  );
});

// Estrategia de red: Priorizar Red para archivos nuevos, Caché para el resto
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request);
    })
  );
});
