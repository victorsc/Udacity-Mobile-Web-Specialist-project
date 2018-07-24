
function createDB() {
  return idb.open('restaurants-db', 1, function(upgradeDb) {
    if (!upgradeDb.objectStoreNames.contains('restaurants')) {
      upgradeDb.createObjectStore('restaurants', {keyPath: 'id'});
    }
    if (!upgradeDb.objectStoreNames.contains('reviews')) {
      const reviewsOS = upgradeDb.createObjectStore('reviews', {keyPath: 'id', autoIncrement: true});
      reviewsOS.createIndex('restaurant_id', 'restaurant_id', {unique: false});
    }
    if (!upgradeDb.objectStoreNames.contains('outbox')) {
      upgradeDb.createObjectStore('outbox', { autoIncrement : true, keyPath: 'id' });
    }
  });
}

const restaurantDb = createDB();

function saveRestaurantsDataLocally(restaurants) {
  return restaurantDb.then(db => {
    const tx = db.transaction('restaurants', 'readwrite');
    const store = tx.objectStore('restaurants');
    return Promise.all(restaurants.map(restaurant => store.put(restaurant)))
      .catch(() => {
        tx.abort();
        throw Error('Restaurants not added.');
      });
  });
}

function saveReviewsDataLocally(reviews) {
  return restaurantDb.then(db => {
    const tx = db.transaction('reviews', 'readwrite');
    const store = tx.objectStore('reviews');
    return Promise.all(reviews.map(review => store.put(review)))
      .catch(() => {
        tx.abort();
        throw Error('Reviews not added.');
      });
  });
}

function getLocalRestaurantsData() {
  return restaurantDb.then(db => {
    const tx = db.transaction('restaurants', 'readonly');
    const store = tx.objectStore('restaurants');
    return store.getAll();
  });
}

function getLocalReviewsData(id) {
  return restaurantDb.then(db => {
    const tx = db.transaction('reviews', 'readonly');
    const store = tx.objectStore('reviews');
    const index = store.index('restaurant_id');
    return index.getAll(id);
  });
}

function putReviewInOutbox(review) {
  return restaurantDb.then(db => {
    const tx = db.transaction('outbox', 'readwrite');
    return tx.objectStore('outbox').put(review);
  });
}

function getReviewsFromOutbox() {
  return restaurantDb.then(db => {
    const tx = db.transaction('outbox', 'readonly');
    return tx.objectStore('outbox').getAll();
  });
}

function deleteReviewFromOutbox(id) {
  return restaurantDb.then(db => {
    const tx = db.transaction('outbox', 'readwrite');
    return tx.objectStore('outbox').delete(id);
  });
}