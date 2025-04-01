self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('countryinns-cache').then((cache) => {
      return cache.addAll([
        '/countryinns-pwa/',
        '/countryinns-pwa/index.html',
        '/countryinns-pwa/manifest.json',
        '/countryinns-pwa/icon-192x192.png',
        '/countryinns-pwa/icon-512x512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
