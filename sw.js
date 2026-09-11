const CACHE_NAME = 'bingeul-tvtime-v15';
const APP_SHELL = [
  './',
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

// Update check using standard request objects so GitHub's routing resolves paths correctly
self.addEventListener('message', (event) => {
  if (event.data !== 'CHECK_FOR_UPDATES') return;
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      let updated = false;

      for (const path of APP_SHELL) {
        try {
          const request = new Request(path);
          const cachedRes = await cache.match(request);
          const netRes = await fetch(path, { cache: 'no-store' });

          if (netRes && netRes.ok) {
            const netText = await netRes.text();
            const cachedText = cachedRes ? await cachedRes.text() : '';

            if (netText !== cachedText) {
              await cache.put(request, new Response(netText, {
                status: netRes.status,
                statusText: netRes.statusText,
                headers: netRes.headers
              }));
              updated = true;
            }
          }
        } catch (e) {
          // Skip network errors for individual assets
        }
      }

      const messageType = updated ? 'NEW_UPDATE_INSTALLED' : 'ALREADY_UP_TO_DATE';
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) => client.postMessage({ type: messageType }));
      });
    })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // Strict local cache-only navigation: never goes online by itself
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then((cached) => {
        return cached || caches.match('./').then((c2) => {
          return c2 || new Response("Offline", { status: 503 });
        });
      })
    );
    return;
  }

  // Cache-first for other assets
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response && response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => undefined);
    })
  );
});
