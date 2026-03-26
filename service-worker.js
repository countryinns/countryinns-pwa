importScripts('https://cdn.onesignal.com/sdks/OneSignalSDKWorker.js');

const CACHE_VERSION = 'v6';
const CACHE_NAME = `countryinns-cache-${CACHE_VERSION}`;
const APP_SCOPE = '/countryinns-pwa/';

const APP_SHELL = [
  `${APP_SCOPE}index.html`,
  `${APP_SCOPE}home.html`,
  `${APP_SCOPE}manifest.webmanifest`,
  `${APP_SCOPE}styles.css`,
  `${APP_SCOPE}app.js`,
  `${APP_SCOPE}favicon.ico`
];

const OFFLINE_PAGE = `${APP_SCOPE}offline.html`;

// =====================
// INSTALL
// =====================
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
});

// =====================
// ACTIVATE (CRITICAL FIX)
// =====================
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

// =====================
// FETCH STRATEGY (CLEANED UP)
// =====================
self.addEventListener('fetch', event => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // 1. ALWAYS NETWORK-FIRST for HTML (CRITICAL FIX)
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(fetch(request, { cache: "no-store" }));
    return;
  }

  // 2. NEVER cache dynamic pub/menu data
  if (url.pathname.includes('/Pub-Food-Drink-Menus/') ||
      url.pathname.includes('/pubs') ||
      url.pathname.includes('/api/')) {
    event.respondWith(fetch(request, { cache: "no-store" }));
    return;
  }

  // 3. App shell assets = cache-first
  event.respondWith(cacheFirst(request));
});

// =====================
// CACHE-FIRST (STATIC ONLY)
// =====================
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
  } catch {
    return caches.match(OFFLINE_PAGE);
  }
}

// =====================
// PUSH NOTIFICATIONS (UNCHANGED)
// =====================
self.addEventListener('push', event => {
  const data = event.data
    ? event.data.json()
    : { title: 'Country Inns', body: 'New update available!', url: APP_SCOPE };

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: `${APP_SCOPE}icons/icon-192x192.png`,
      badge: `${APP_SCOPE}icons/icon-72x72.png`,
      data: data.url
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data));
});
