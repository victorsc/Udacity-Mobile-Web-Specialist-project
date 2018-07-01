let restaurants = [];
for (i=1; i<=10; i++) {
  restaurants.push("img/" + i + "_300.jpg");
  restaurants.push("img/" + i + "_800.jpg");
  restaurants.push("restaurant.html?id=" + i);
}

let urlsToCache = [
  '/',
  'js/main.min.js',
  'js/restaurant.min.js',
  'css/styles.css'
].concat(restaurants);

let CACHE_V1 = 'myCache';

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_V1).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName !== CACHE_V1) {
            return caches.delete(cacheName);
          }
        })
      )
    })
  )
});