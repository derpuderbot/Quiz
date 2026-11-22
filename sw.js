/**
 * Service Worker für Offline-Support
 * Optional - einfach löschen falls nicht gewünscht
 */

const CACHE_NAME = 'wwm-quiz-v2';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './questions.json'
];

// Install: Assets cachen
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: Alte Caches löschen
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Cache-First Strategy
self.addEventListener('fetch', (event) => {
  // Nur GET requests cachen
  if (event.request.method !== 'GET') return;

  // Google Fonts nicht cachen (Cross-Origin)
  if (event.request.url.includes('fonts.googleapis.com') ||
      event.request.url.includes('fonts.gstatic.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Aus Cache liefern falls vorhanden
        if (cachedResponse) {
          // Im Hintergrund aktualisieren (stale-while-revalidate)
          event.waitUntil(
            fetch(event.request)
              .then((networkResponse) => {
                if (networkResponse.ok) {
                  caches.open(CACHE_NAME)
                    .then((cache) => cache.put(event.request, networkResponse.clone()));
                }
              })
              .catch(() => { /* Offline - ignorieren */ })
          );
          return cachedResponse;
        }

        // Nicht im Cache: Netzwerk versuchen
        return fetch(event.request)
          .then((networkResponse) => {
            // Nur erfolgreiche Responses cachen
            if (networkResponse.ok) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(event.request, responseClone));
            }
            return networkResponse;
          })
          .catch(() => {
            // Offline Fallback für HTML
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }
            // Für andere Assets: Error Response
            return new Response('Offline - Asset nicht verfügbar', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Message Handling (für manuelles Update)
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
