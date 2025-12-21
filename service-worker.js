importScripts('https://cdn.onesignal.com/sdks/OneSignalSDKWorker.js');


const CACHE_VERSION = 'v4';
const CACHE_NAME = `countryinns-cache-${CACHE_VERSION}`;
const APP_SCOPE = '/countryinns-pwa/';

const APP_SHELL = [
  `${APP_SCOPE}`,
  `${APP_SCOPE}index.html`,
  `${APP_SCOPE}manifest.webmanifest`,
  `${APP_SCOPE}styles.css`,
  `${APP_SCOPE}app.js`,
  `${APP_SCOPE}favicon.ico`
];

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
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// FETCH
self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  // External menus → network-first, auto-cache
  if (request.url.includes('/Pub-Food-Drink-Menus/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // HTML pages → network-first
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Everything else → cache-first
  event.respondWith(cacheFirst(request));
});

// STRATEGIES
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  const cache = await caches.open(CACHE_NAME);
  cache.put(request, response.clone());
  return response;
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
  } catch {
    return caches.match(request) || caches.match(`${APP_SCOPE}index.html`);
  }
}
