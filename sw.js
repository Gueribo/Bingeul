const CACHE_NAME = 'bingeul-tvtime-v12';
const APP_SHELL = [
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(APP_SHELL.map((url) => cache.add(url)))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

// Manual update check using absolute URL resolution to prevent GitHub Pages fetch errors.
self.addEventListener('message', (event) => {
  if (event.data !== 'CHECK_FOR_UPDATES') return;
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      let updatedCount = 0;
      let unchangedCount = 0;
      let errors = [];

      for (const url of APP_SHELL) {
        try {
          // Resolve absolute URL safely based on service worker location
          const absoluteUrl = new URL(url, self.location).href;
          const newRes = await fetch(absoluteUrl, { cache: 'no-store' });
          
          if (!newRes || !newRes.ok) {
            throw new Error(`HTTP ${newRes ? newRes.status : '?'}`);
          }
          const newText = await newRes.text();
          
          const cachedRes = await cache.match(url);
          const cachedText = cachedRes ? await cachedRes.text() : null;

          if (cachedText === newText) {
            unchangedCount++;
          } else {
            const freshResForCache = new Response(newText, {
              status: newRes.status,
              statusText: newRes.statusText,
              headers: newRes.headers
            });
            await cache.put(url, freshResForCache);
            updatedCount++;
          }
        } catch (err) {
          errors.push(`${url}: ${err.message || err}`);
        }
      }

      const statusType = updatedCount > 0 ? 'NEW_UPDATE_INSTALLED' : 'ALREADY_UP_TO_DATE';

      self.clients.matchAll().then((clients) => {
        clients.forEach((client) =>
          client.postMessage({
            type: statusType,
            updatedCount,
            unchangedCount,
            total: APP_SHELL.length,
            errors
          })
        );
      });
    }).catch((err) => {
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) =>
          client.postMessage({
            type: 'UPDATE_CHECK_ERROR',
            errors: [String((err && err.message) || err)]
          })
        );
      });
    })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then((cached) => {
        if (cached) return cached;
        return fetch(event.request).catch(() => new Response("App offline and shell not cached.", { status: 503, headers: { 'Content-Type': 'text/plain' } }));
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          if (response && response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => undefined);
    })
  );
});
