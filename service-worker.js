const CACHE_NAME = 'countryinns-cache-v1';

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/assets/Screenshot1.png',
  '/assets/Screenshot2.png',
  '/assets/Screenshot3.png',
  '/styles.css',
  '/app.js',

  // Menus from external GitHub repo
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-Bold-Forester/NEW-MENU-SPRING-SUMMER-2025.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-Bold-Forester/NEW-SUNDAY-MENU-SPRING-SUMMER-2025.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-Bold-Forester/New-Dessert-Menu-2025.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-Bold-Forester/The-Bold-Forester-Cocktail-Menu.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-Bold-Forester/Tiny-Tums-Menu-2025.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-Bold-Forester/Wine-List.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-Bold-Forester/updated-drinks-menu-25th-feb.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-Fighting-Cocks/Breakfast-Menu-2025.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-Fighting-Cocks/Dessert-ice-cream-menu-march-2025.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-Fighting-Cocks/Kids-menu.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-Fighting-Cocks/Wine-List.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-Fighting-Cocks/new-menu-march-2025.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-Fighting-Cocks/new-sunday-menu-march.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-Lamb-Inn/Dessert-menu-March-2024.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-Lamb-Inn/Lamb-Kids-Menu.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-Lamb-Inn/Lamb-sunday-menu-dec-2024.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-Lamb-Inn/Spring-Summer-Menu-March-2025.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-Lamb-Inn/The-Lamb-Inn-Cocktail-Menu.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-Lamb-Inn/Wine-List.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-New-Forest-Inn/Breakfast-Menu-dec-2024.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-New-Forest-Inn/Dessert-Menu-25.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-New-Forest-Inn/Main-Menu-Spring-2025.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-New-Forest-Inn/News-kids-2-25.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-New-Forest-Inn/Sunday-Menu-Spring-2025.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-New-Forest-Inn/Wine-List.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-Royal-Oak/0-Drinks.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-Royal-Oak/Drinks-list-1.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-Royal-Oak/Hot-Drinks-May-2024.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-Royal-Oak/ROB-Spring-Summer-Menu-25.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-Royal-Oak/ROB-Spring-Summer-Sunday-Menu-25.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-Royal-Oak/Wine-List.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-Royal-Oak/Winter-Dessert-Menu.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-Trusty-Servant/Breakfast-Menu-Oct-2024.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-Trusty-Servant/Laz-Spring-Garden-Menu.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-Trusty-Servant/Laz-Spring-Sunday-Menu.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-Trusty-Servant/March-24-dessert-menu.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-Trusty-Servant/Tiny-tums-menu.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-Trusty-Servant/Trusty-Servant-Spritz-Menu.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-Trusty-Servant/Wine-List.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-Trusty-Servant/may-2024-coffee-menu.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-Woolpack/Summer-2-course.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-Woolpack/Summer-sunday-menu-2025.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-Woolpack/Wine-List.html',
  'https://countryinns.github.io/Pub-Food-Drink-Menus/html-menus/The-Woolpack/summer-menu-2025.html'
];

// Install and cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

// Clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => 
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});

// Fetch with network-first, fallback to cache, plus offline banner
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (event.request.method === 'GET' && response.status === 200) {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, cloned);
          });
        }
        return response;
      })
      .catch(() => {
        // Notify clients when offline
        if (self.clients) {
          self.clients.matchAll().then((clients) => {
            clients.forEach((client) => {
              client.postMessage({ type: 'OFFLINE' });
            });
          });
        }

        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          if (event.request.url.includes('.html')) {
            return caches.match('/index.html');
          }
        });
      })
  );
});
