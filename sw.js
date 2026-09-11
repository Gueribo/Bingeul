const CACHE_NAME = 'bingeul-tvtime-v13';
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
            throw new Error(`HTTP ${response ? response.status : '?'} — ${url}`);
          })
        )
      )
    ).then((results) => {
      const success = results.filter((r) => r.status === 'fulfilled').length;
      const errors = results
        .filter((r) => r.status === 'rejected')
        .map((r) => (r.reason && r.reason.message) || String(r.reason));
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) =>
          client.postMessage({ type: 'UPDATE_CHECK_DONE', success, total: APP_SHELL.length, errors })
        );
      });
    }).catch((err) => {
      self.clients.matchAll().then((clients) => {
        clients.forEach((client) =>
          client.postMessage({
            type: 'UPDATE_CHECK_DONE',
            success: 0,
            total: APP_SHELL.length,
            errors: [String((err && err.message) || err)]
          })
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

  // Toute navigation (ouverture ou rechargement de l'app — tiré vers
  // le bas, geste retour, peu importe l'URL exacte tapée ou générée)
  // sert systématiquement la page d'accueil déjà en cache.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then((cached) => cached || new Response('', { status: 503 }))
    );
    return;
  }

  // Pour le reste (style.css, app.js, icônes...) : cache UNIQUEMENT,
  // sans la moindre exception — aucune tentative réseau automatique,
  // même en repli si jamais un fichier manquait du cache. On compare
  // par chemin plutôt que par requête exacte (ignoreSearch), plus
  // tolérant aux petites variations que le navigateur peut ajouter à
  // une requête d'une fois à l'autre, qui faisaient parfois "rater" la
  // correspondance et déclenchaient un appel réseau non désiré.
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((cached) => {
      return cached || new Response('', { status: 404 });
    })
  );
});
