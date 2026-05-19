const CACHE_VERSION = 'v9';
const CACHE_NAME = `countryinns-cache-${CACHE_VERSION}`;
const APP_SCOPE = '/countryinns-pwa/';
const OFFLINE_PAGE = `${APP_SCOPE}offline.html`;

/* CORE APP SHELL */
const STATIC_ASSETS = [
  `${APP_SCOPE}home.html`,
  `${APP_SCOPE}index.html`,
  `${APP_SCOPE}offline.html`,
  `${APP_SCOPE}styles.css`,
  `${APP_SCOPE}app.js`,
  `${APP_SCOPE}manifest.webmanifest`,
  `${APP_SCOPE}favicon.ico`
];

/* INSTALL */
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  );
});

/* ACTIVATE */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

/* FETCH */
self.addEventListener('fetch', event => {
  const req = event.request;

  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  /* 1. HTML = network first (with offline fallback) */
  if (req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then(res => res)
        .catch(() => caches.match(OFFLINE_PAGE))
    );
    return;
  }

  /* 2. IMAGES = cache-first (BIG performance win) */
  if (url.pathname.match(/\.(png|jpg|jpeg|webp|svg)$/)) {
    event.respondWith(cacheFirst(req));
    return;
  }

  /* 3. STATIC ASSETS = stale-while-revalidate */
  event.respondWith(staleWhileRevalidate(req));
});

/* CACHE-FIRST (images, media) */
async function cacheFirst(req) {
  const cached = await caches.match(req);
  if (cached) return cached;

  const res = await fetch(req);
  const cache = await caches.open(CACHE_NAME);
  cache.put(req, res.clone());
  return res;
}

/* STALE-WHILE-REVALIDATE (CSS/JS/etc) */
async function staleWhileRevalidate(req) {
  const cached = await caches.match(req);

  const fetchPromise = fetch(req).then(res => {
    caches.open(CACHE_NAME).then(cache => cache.put(req, res.clone()));
    return res;
  }).catch(() => cached);

  return cached || fetchPromise;
}
