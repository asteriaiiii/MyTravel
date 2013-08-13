var api = {
	xhr : null
};

exports.getData=function(lat, lon, radius, types, name, sensor, success, error) {
	if (api.xhr == null) {
		api.xhr = Titanium.Network.createHTTPClient();
	}

	var url = "https://maps.googleapis.com/maps/api/place/search/json?";
	url = url + "location=" + lat + ',' + lon;
	url = url + "&radius=" + radius;
	url = url + "&types=" + types;
	url = url + "&name=" + name;
	url = url + "&sensor=" + sensor;
	url = url + "&key=" + Titanium.App.Properties.getString("googlePlacesAPIKey");
	Ti.API.info(url);

	api.xhr.open('GET', url);
	api.xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

	api.xhr.onerror = function(e) {
		Ti.API.error("API ERROR " + e.error);
		if (error) {
			error(e);
		}
	};

	api.xhr.onload = function() {
		Ti.API.debug("API response: " + this.responseText);
		if (success) {
			var jsonResponse = JSON.parse(this.responseText);
			success(jsonResponse);
		}
	};

	api.xhr.send();
}
exports.getPlaceDetails=function(reference, sensor, success, error) {
	if (api.xhr == null) {
		api.xhr = Titanium.Network.createHTTPClient();
	}

	var url = "https://maps.googleapis.com/maps/api/place/details/json?";
	url = url + "reference=" + reference;
	url = url + "&sensor=" + sensor;
	url = url + "&key=" + Titanium.App.Properties.getString("googlePlacesAPIKey");
	Ti.API.info(url);

	api.xhr.open('GET', url);
	api.xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

	api.xhr.onerror = function(e) {
		alext("Error");
		Ti.API.error("API ERROR " + e.error);
		if (error) {
			error(e);

		}
	};

	api.xhr.onload = function() {
		Ti.API.debug("API response: " + this.responseText);
		if (success) {
			var jsonResponse = JSON.parse(this.responseText);
			success(jsonResponse);

		}
	};

	api.xhr.send();
}
//=======================================Get address from location===========================
Titanium.Geolocation.getCurrentPosition( function(e) {
    if (!e.success) {
        alert('Could not retrieve location');
        return;
    }
    //here are users coordinates
    var longitude = e.coords.longitude;
    var latitude = e.coords.latitude;
 
    // try to get address
});

