// MeteoRutas service worker.
//
// Intentionally does NOT cache anything. Its only job is to satisfy the
// installability requirements of Chromium browsers (manifest + SW present)
// while guaranteeing every load hits the network — the data in this app
// (weather, routing) is only useful when fresh, so a cached app shell would
// actively work against the app's purpose.

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request, { cache: 'no-store' }).catch(() => {
      // Offline and nothing cached — let the browser show its default offline page.
      return Response.error();
    })
  );
});
