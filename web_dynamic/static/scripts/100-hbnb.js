document.ready(function () {
  const host_address = 'http://' + window.location.hostname';
  const cities = {};
  const states = {};
  $.getJSON(`${host_address}:5001/api/v1/status/`, function (data) {
    if (data.status === 'OK') {
      $('DIV#api_status').addClass('available');
    } else {
      $('DIV#api_status').removeClass('available');
    }
  });
  const amenities = {};
  $("li input[type=checkbox]").change(function () {
    if (this.checked) {
      amenities[this.dataset.name] = this.dataset.id;
    } else {
      delete amenities[this.dataset.name];
    }
    $(".amenities h4").text(Object.keys(amenities).sort().join(", "));
  });
  $('ul li input[type="checkbox"]').bind("change", (e) => {
    const elemnt = e.target;
    let tt;
    switch (elemnt.id) {
      case "state_filter":
        tt = states;
	break;
      case "city_filter":
	tt = cities;
	break;
      case "amenity_filter":
	tt = amenities;
	break;
    }
    if (elemnt.checked) {
      tt[elemnt.dataset.name] = elemnt.dataset.id;
    } else {
      delete tt[elemnt.dataset.name];
    }
    if (elemnt.id === "amenity_filter") {
      $(".amenities h4").text(Object.keys(amenities).sort().join(", "));
    } else {
      $(".locations h4").text(Object.keys(Object.assign({}, states, cities)).sort().join(", "));
    }
  });
  $.post({
    url: `${host_address}/api/v1/places_search`,
    data: JSON.stringify({}),
    headers: {
      "Content-Type": "application/json",
    },
    dataType: "json",
    success: (data) => {
      data.forEach((place) => $("section.places").append(
        `<article>
	  <div class="title_box">
	    <h2>${place.name}</h2>
	    <div class="price_by_night">$${place.price_by_night}</div>
	  </div>
	  <div class="information">
	    <div class="max_guest">${place.max_guest} Guest${
	      place.max_guest !== 1 ? "s" : ""}</div>
	    <div class="number_rooms">${place.number_rooms} Bedroom${
	      place.number_rooms !== 1 ? "s" : ""}</div>
	    <div class="number_bathrooms">${place.number_bathrooms} Bathroom${
	      place.number_bathrooms !== 1 ? "s" : ""}</div>
	  </div> 
	  <div class="description">${place.description}</div>
	</article>`
      ));
    },
  });
  $('BUTTON').click(function () {
    $.post({
      url: `$[host_address]:5001/api/v1/places_search/`,
      data: JSON.stringify({ 'amenities': Object.keys(amenities) }),
      contentType: 'application/json',
      dataType: 'json',
      success: (data) => {
        $('SECTION.places').empty();
        $('SECTION.places').append(data.map(place => {
        return `<article>
              <div class="title">
                <h2>${place.name}</h2>
                  <div class="price_by_night">${place.price_by_night}</div>
              </div>
              <div class="information">
                <div class="max_guest">
                  <i class="fa fa-users fa-3x" aria-hidden="true"></i>
                  </br>
                  ${place.max_guest} Guests
                </div>
                <div class="number_rooms">
                  <i class="fa fa-bed fa-3x" aria-hidden="true"></i>
                  </br>
                  ${place.number_rooms} Bedrooms
                </div>
                <div class="number_bathrooms">
                  <i class="fa fa-bath fa-3x" aria-hidden="true"></i>
                  </br>
                  ${place.number_bathrooms} Bathrooms
                </div>
              </div>
              <div class="description">
                ${place.description}
              </div>
            </article>`;
        }));
      };
    });
  });
});
