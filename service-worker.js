const CACHE_VERSION = 'v7';
const CACHE_NAME = `countryinns-cache-${CACHE_VERSION}`;
const APP_SCOPE = '/countryinns-pwa/';

const APP_SHELL = [
  `${APP_SCOPE}home.html`,
  `${APP_SCOPE}index.html`,
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
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
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
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;

  // NEVER cache HTML (critical fix for your bug)
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(fetch(request, { cache: 'no-store' }));
    return;
  }

  // NEVER cache dynamic data endpoints
  if (url.pathname.includes('/api/') ||
      url.pathname.includes('/pubs') ||
      url.pathname.includes('/Pub-Food-Drink-Menus/')) {
    event.respondWith(fetch(request, { cache: 'no-store' }));
    return;
  }

  // Cache-only static assets
  event.respondWith(cacheFirst(request));
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  const cache = await caches.open(CACHE_NAME);
  cache.put(request, response.clone());
  return response;
}
