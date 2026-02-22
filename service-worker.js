importScripts('https://cdn.onesignal.com/sdks/OneSignalSDKWorker.js');

const CACHE_VERSION = 'v5';
const CACHE_NAME = `countryinns-cache-${CACHE_VERSION}`;
const APP_SCOPE = '/countryinns-pwa/';

// Core PWA files to cache
const APP_SHELL = [
  `${APP_SCOPE}index.html`,        // QR landing page
  `${APP_SCOPE}home.html`,         // Main PWA page
  `${APP_SCOPE}manifest.webmanifest`,
  `${APP_SCOPE}styles.css`,
  `${APP_SCOPE}app.js`,
  `${APP_SCOPE}favicon.ico`
];

// Optional: offline fallback page
const OFFLINE_PAGE = `${APP_SCOPE}offline.html`;

// INSTALL
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll([...APP_SHELL, OFFLINE_PAGE]))
  );
});

// ACTIVATE
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// FETCH
self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  // Network-first for HTML pages
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Network-first for external menus
  if (request.url.includes('/Pub-Food-Drink-Menus/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Cache-first for other assets (CSS, JS, images)
  event.respondWith(cacheFirst(request));
});

// ===== STRATEGIES =====
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

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
    return response;
  } catch {
    return caches.match(request) || caches.match(OFFLINE_PAGE);
  }
}

// ===== PUSH NOTIFICATIONS =====
self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : { title: 'Country Inns', body: 'New update available!', url: APP_SCOPE };
  const options = {
    body: data.body,
    icon: `${APP_SCOPE}icons/icon-192x192.png`,
    badge: `${APP_SCOPE}icons/icon-72x72.png`,
    data: data.url
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data));
});
