const CACHE_VERSION = 'v7';
const CACHE_NAME = `countryinns-cache-${CACHE_VERSION}`;
const APP_SCOPE = '/countryinns-pwa/';

const APP_SHELL = [
  `${APP_SCOPE}home.html`,
  `${APP_SCOPE}index.html`,
  `${APP_SCOPE}offline.htnml`,
  `${APP_SCOPE}styles.css`,
  `${APP_SCOPE}app.js`,
  `${APP_SCOPE}manifest.webmanifest`,
  `${APP_SCOPE}favicon.ico`
];

const OFFLINE_PAGE = `${APP_SCOPE}offline.html`;

// INSTALL
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

// ACTIVATE
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

// FETCH
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.method !== 'GET') return;

  /* HTML always network-first */
  if (req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req).catch(() => caches.match(`${APP_SCOPE}offline.html`))
    );
    return;
  }

  /* Images cache */
  if (url.pathname.match(/\.(png|jpg|jpeg|webp|svg)$/)) {
    event.respondWith(
      caches.match(req).then(res =>
        res || fetch(req).then(fetchRes => {
          const copy = fetchRes.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
          return fetchRes;
        })
      )
    );
    return;
  }

  /* Default */
  event.respondWith(
    fetch(req).catch(() => caches.match(req))
  );
});
