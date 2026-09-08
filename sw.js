const CACHE_NAME = 'bingeul-tvtime-v3';
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
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
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

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Seul l'app shell (ce même dossier) est géré ici. Tout ce qui est
  // cross-origin — TMDB (recherche, détails, casting, recommandations,
  // affiches) et le placeholder — part directement vers le réseau ;
  // l'app gère déjà elle-même les échecs de ces appels quand hors-ligne.
  if (url.origin !== self.location.origin) return;

  // Réseau d'abord : si le site est joignable (ex. GitHub Pages
  // temporairement réactivé), on récupère toujours la toute dernière
  // version et on met le cache à jour. S'il est injoignable (cas normal
  // ici, Pages désactivé la plupart du temps, ou vraiment hors-ligne),
  // on se rabat immédiatement sur la version en cache.
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response && response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
