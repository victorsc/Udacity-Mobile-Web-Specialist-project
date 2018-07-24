let restaurant;
let map;

const encodeHTML = (s) => {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
}

const cleanForm = () => {
  document.getElementById('reviewer-name').value = "";
  document.getElementById('review-comment').value = "";
}

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
}

/**
 * Get current restaurant from page URL.
 */
window.fetchRestaurantFromURL = (callback) => {
  const id = parseInt(getParameterByName('id'));
  if (!id) { // no id found in URL
    callback('No restaurant id in URL', null);
  }
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant)
    return;
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant);
      DBHelper.getReviewsForRestaurant(id, (reviews) => {
        self.restaurant.reviews = reviews;
        fillReviewsHTML();
      });
    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 */
window.fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const button = document.getElementById('favorite-button');
  if (restaurant.is_favorite == 'true') {
    button.setAttribute('aria-pressed', 'true');
    button.setAttribute('aria-label', 'Unmark as favorite');
    button.style.color = 'orange';
  } else {
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-label', 'Mark as favorite');
    button.style.color = 'black';
  }

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img'
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.alt = restaurant.name + " picture";

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
}

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
window.fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
}

/**
 * Create all reviews HTML and add them to the webpage.
 */
window.fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h2');
  title.innerHTML = 'Restaurant reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
}

/**
 * Create review HTML and add it to the webpage.
 */
window.createReviewHTML = (review) => {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.innerHTML = review.name;
  li.appendChild(name);

  const date = document.createElement('p');
  date.innerHTML = new Date(review.createdAt).toLocaleDateString();
  li.appendChild(date);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
}

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
window.fillBreadcrumb = (restaurant=self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
}

/**
 * Get a parameter by name from page URL.
 */
window.getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

window.toggleFavorite = (event) => {
  const button = event.target;
  if (button.getAttribute('aria-pressed') == 'false') {
    DBHelper.toggleFavorite(self.restaurant.id, true, () => {
      self.restaurant.is_favorite = 'true';
      button.setAttribute('aria-pressed', 'true');
      button.setAttribute('aria-label', 'Unmark as favorite');
      button.style.color = 'orange';
    });
  } else {
    DBHelper.toggleFavorite(self.restaurant.id, false, () => {
      self.restaurant.is_favorite = 'false';
      button.setAttribute('aria-pressed', 'false');
      button.setAttribute('aria-label', 'Mark as favorite');
      button.style.color = 'black';
    });
  }
}

window.scheduleSendReview = () => {
  const data = {
    restaurant_id: self.restaurant.id,
    name: self.encodeHTML(document.getElementById('reviewer-name').value),
    rating: document.getElementById('review-rating').value,
    comments: self.encodeHTML(document.getElementById('review-comment').value)
  };

  putReviewInOutbox(data).then(function() {
    self.cleanForm();
    return navigator.serviceWorker.ready.then(function(swRegistration) {
      console.log('registering the sync'); 
      return swRegistration.sync.register('sendRestaurantReview');
    });
  }).catch(function(err) {
    console.error(err); 
  });
}

// window.sendReview = () => {
//   return DBHelper.reviewRestaurant(data, () => {
//     location.reload(true);
//   });
// }


