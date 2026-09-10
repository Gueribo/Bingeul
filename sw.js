const CACHE_NAME = 'bingeul-tvtime-v8';
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
      // Chaque fichier est mis en cache indépendamment : si l'un
      // d'eux est introuvable, les autres sont quand même mis en
      // cache et le service worker s'installe correctement.
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

// Resynchronisation à la demande : la page envoie ce message quand
// GitHub Pages est temporairement réactivé (bouton "Vérifier les mises
// à jour" dans Paramètres), pour forcer le rechargement de tous les
// fichiers depuis le réseau et rafraîchir le cache d'un coup.
self.addEventListener('message', (event) => {
  if (event.data !== 'CHECK_FOR_UPDATES') return;
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(
        APP_SHELL.map((url) =>
          fetch(url, { cache: 'no-store' }).then((response) => {
            if (response && response.ok) return cache.put(url, response);
            throw new Error('bad response');
          })
        )
      )
    ).then((results) => {
      const success = results.filter((r) => r.status === 'fulfilled').length;
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) =>
          client.postMessage({ type: 'UPDATE_CHECK_DONE', success, total: APP_SHELL.length })
        );
      });
    })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Cross-origin (TMDB, images, placeholder...) : toujours direct au
  // réseau, l'app gère déjà elle-même ces échecs quand hors-ligne.
  if (url.origin !== self.location.origin) return;

  // Cache d'abord, systématiquement : l'app tourne quasi exclusivement
  // sur les fichiers déjà en cache, puisque GitHub Pages n'est actif
  // que ponctuellement. Pas besoin de vérifier le réseau à chaque
  // ouverture — la mise à jour se fait uniquement à la demande, via le
  // message ci-dessus.
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      // Rien en cache (ex. toute première visite) : tente le réseau.
      return fetch(event.request)
        .then((response) => {
          if (response && response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            return response;
          }
          // Le réseau a bien répondu, mais avec une erreur (ex. 404 de
          // GitHub Pages désactivé) : ce n'est pas un échec réseau à
          // proprement parler, donc ça ne déclenche pas .catch() plus
          // bas — il faut le gérer ici aussi, pas seulement en cas de
          // panne réseau complète.
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html').then((fallback) => fallback || response);
          }
          return response;
        })
        .catch(() => (event.request.mode === 'navigate' ? caches.match('./index.html') : undefined));
    })
  );
});
