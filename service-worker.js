const CACHE_NAME = 'countryinns-cache-v1'; // Version the cache to handle updates
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/assets/screenshot1.png',
  '/assets/screenshot2.png',
  '/assets/screenshot3.png',
  '/styles.css',  // Example: If you have a CSS file
  '/app.js'        // Example: If you have a JS file
];

// Install the service worker and cache files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate the service worker and clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME]; // Only keep the current version cache
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName); // Delete old caches
          }
        })
      );
    })
  );
});

// Fetch from network, then cache, and return cached if offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Check if the response is valid and cache it
        if (event.request.method === 'GET' && response.status === 200) {
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse); // Add response to cache
          });
        }
        return response;
      })
      .catch(() => {
        // If network fails, return cached version
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          } else if (event.request.url.includes('.html')) {
            return caches.match('/index.html'); // Fallback to index.html if no cached version
          }
        });
      })
  );
});
