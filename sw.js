const CACHE_NAME = 'bingeul-tvtime-v13';

// Dynamically build correct absolute URLs matching GitHub Pages scope repository subfolder
const scopePath = self.registration.scope;
const APP_SHELL = [
  scopePath + 'index.html',
  scopePath + 'style.css',
  scopePath + 'app.js',
  scopePath + 'manifest.json',
  scopePath + 'icon-192.png',
  scopePath + 'icon-512.png',
  scopePath + 'icon-512-maskable.png',
  scopePath + 'apple-touch-icon.png'
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

// Streamlined update checker compatible with GitHub Pages environment
self.addEventListener('message', (event) => {
  if (event.data !== 'CHECK_FOR_UPDATES') return;
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      let updated = false;
      
      for (const url of APP_SHELL) {
        try {
          const cachedRes = await cache.match(url);
          const netRes = await fetch(url, { cache: 'no-store' });
          
          if (netRes && netRes.ok) {
            const netText = await netRes.text();
            const cachedText = cachedRes ? await cachedRes.text() : '';

            if (netText !== cachedText) {
              await cache.put(url, new Response(netText, {
                status: netRes.status,
                statusText: netRes.statusText,
                headers: netRes.headers
              }));
              updated = true;
            }
          }
        } catch (e) {
          // Ignore individual asset network hiccups during check
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
      caches.match(scopePath + 'index.html').then((cached) => {
        return cached || caches.match('./index.html').then((c2) => {
          return c2 || new Response("Offline", { status: 503 });
        });
      })
    );
    return;
  }

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
