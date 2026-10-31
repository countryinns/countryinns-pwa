
const CACHE_VERSION = 'v10';
const CACHE_NAME = `countryinns-cache-${CACHE_VERSION}`;
const CACHE_PREFIX = 'countryinns-cache-';

const APP_SCOPE = '/countryinns-pwa/';
const OFFLINE_PAGE = `${APP_SCOPE}offline.html`;

// Main app files and all eight pub pages
const STATIC_ASSETS = [
  `${APP_SCOPE}home.html`,
  `${APP_SCOPE}index.html`,
  `${APP_SCOPE}offline.html`,
  `${APP_SCOPE}manifest.webmanifest`,
  `${APP_SCOPE}favicon.ico`,

  // Pub pages
  `${APP_SCOPE}boldforester.html`,
  `${APP_SCOPE}lambinn.html`,
  `${APP_SCOPE}royaloak.html`,
  `${APP_SCOPE}woolpack.html`,
  `${APP_SCOPE}fightingcocks.html`,
  `${APP_SCOPE}trustyservant.html`,
  `${APP_SCOPE}newforestinn.html`,
  `${APP_SCOPE}rockinghamarms.html`
];


// INSTALL
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return Promise.all(
        STATIC_ASSETS.map(function(url) {
          return cache.add(url).catch(function(error) {
            console.warn('Could not cache:', url, error);
          });
        })
      );
    }).then(function() {
      return self.skipWaiting();
    })
  );
});


// ACTIVATE
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.map(function(key) {
          // Delete only old Country Inns caches.
          // Do not delete caches belonging to other websites.
          if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});


// FETCH
self.addEventListener('fetch', function(event) {
  const req = event.request;

  if (req.method !== 'GET') {
    return;
  }

  const url = new URL(req.url);

  // Only handle requests belonging to this PWA.
  if (
    url.origin !== self.location.origin ||
    !url.pathname.startsWith(APP_SCOPE)
  ) {
    return;
  }

  // HTML pages: network first, then cached page, then offline page.
  if (req.headers.get('accept') &&
      req.headers.get('accept').includes('text/html')) {

    event.respondWith(
      fetch(req).then(function(response) {
        if (response && response.ok) {
          const copy = response.clone();

          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(req, copy);
          });
        }

        return response;

      }).catch(function() {

        return caches.match(req, { ignoreSearch: true })
          .then(function(cachedPage) {

            if (cachedPage) {
              return cachedPage;
            }

            return caches.match(OFFLINE_PAGE);
          });
      })
    );

    return;
  }


  // Images: cache first.
  if (url.pathname.match(/\.(png|jpg|jpeg|webp|svg|ico)$/i)) {
    event.respondWith(cacheFirst(req));
    return;
  }


  // Other files: stale while revalidate.
  event.respondWith(staleWhileRevalidate(req));
});


// CACHE FIRST
async function cacheFirst(req) {
  const cached = await caches.match(req);

  if (cached) {
    return cached;
  }

  const response = await fetch(req);

  if (response && response.ok) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(req, response.clone());
  }

  return response;
}


// STALE WHILE REVALIDATE
async function staleWhileRevalidate(req) {
  const cached = await caches.match(req);

  const fetchPromise = fetch(req).then(function(response) {
    if (response && response.ok) {
      caches.open(CACHE_NAME).then(function(cache) {
        cache.put(req, response.clone());
      });
    }

    return response;

  }).catch(function() {
    return cached;
  });

  return cached || fetchPromise;
}
