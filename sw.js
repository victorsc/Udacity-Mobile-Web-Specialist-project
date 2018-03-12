self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('myCache').then(function(cache) {
      let restaurants = [];
      for (i=1; i<=10; i++) {
        restaurants.push("img/" + i + ".jpg");
        restaurants.push("restaurant.html?id=" + i);
      }

      return cache.addAll([
        '/',
        'js/main.js',
        'js/dbhelper.js',
        'js/restaurant_info.js',
        'css/styles.css',
        'data/restaurants.json',
        new Request('https://maps.googleapis.com/maps/api/js?key=AIzaSyDDyV7Vq36GivqI5jN_8G4SmlgKIP0K0zM&libraries=places&callback=initMap', { mode: 'no-cors' })
      ].concat(restaurants)
      );
    })
  );
});


self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request, {mode: 'no-cors'});
    })
  );
});