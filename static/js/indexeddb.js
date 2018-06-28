
function createDB() {
  return idb.open('restaurants-db', 2, function(upgradeDb) {
    switch (upgradeDb.oldVersion) {
      case 0:
        // backup
      case 1:
        if (!upgradeDb.objectStoreNames.contains('restaurants')) {
          upgradeDb.createObjectStore('restaurants', {keyPath: 'id'});
        }
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

function getLocalRestaurantsData() {
  return restaurantDb.then(db => {
    const tx = db.transaction('restaurants', 'readonly');
    const store = tx.objectStore('restaurants');
    return store.getAll();
  });
}
