
const CACHE_VERSION = 'v10';
const CACHE_NAME = `countryinns-cache-${CACHE_VERSION}`;
const CACHE_PREFIX = 'countryinns-cache-';
const APP_SCOPE = '/countryinns-pwa/';
const OFFLINE_PAGE = `${APP_SCOPE}offline.html`;

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
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      // The offline page is essential for the fallback to work.
      await cache.add(OFFLINE_PAGE);

      // Cache other assets individually so one missing file
      // doesn't prevent the service worker from installing.
      await Promise.allSettled(
        STATIC_ASSETS
          .filter(url => url !== OFFLINE_PAGE)
          .map(url => cache.add(url))
      );
    })()
  );
});

/* ACTIVATE */
self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();

      await Promise.all(
        keys
          .filter(key =>
            key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME
          )
          .map(key => caches.delete(key))
      );

      await self.clients.claim();
    })()
  );
});

/* FETCH */
self.addEventListener('fetch', event => {
  const req = event.request;

  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Only manage requests belonging to this PWA.
  if (
    url.origin !== self.location.origin ||
    !url.pathname.startsWith(APP_SCOPE)
  ) {
    return;
  }

  // HTML: network first, then cached page, then offline page.
  if (req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      (async () => {
        try {
          return await fetch(req);
        } catch (error) {
          const cachedPage = await caches.match(req);

          if (cachedPage) return cachedPage;

          const offlinePage = await caches.match(OFFLINE_PAGE);

          if (offlinePage) return offlinePage;

          return new Response('You are offline.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' }
          });
        }
      })()
    );

    return;
  }

  // Images: cache first.
  if (/\.(png|jpg|jpeg|webp|svg|ico)$/i.test(url.pathname)) {
    event.respondWith(cacheFirst(req));
    return;
  }

  // Other app assets: stale while revalidating.
  event.respondWith(staleWhileRevalidate(req));
});

/* CACHE FIRST */
async function cacheFirst(req) {
  const cached = await caches.match(req);

  if (cached) return cached;

  const response = await fetch(req);

  if (response.ok) {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(req, response.clone());
  }

  return response;
}

/* STALE WHILE REVALIDATE */
async function staleWhileRevalidate(req) {
  const cached = await caches.match(req);

  const fetchPromise = fetch(req).then(async response => {
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(req, response.clone());
    }

    return response;
  });

  if (cached) {
    // Refresh the cache in the background.
    fetchPromise.catch(() => {});
    return cached;
  }

  return fetchPromise;
}
