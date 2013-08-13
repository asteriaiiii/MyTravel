var mapData = {};

exports.watchMap = function(mapView) {
  mapView.addEventListener('regionChanged', function(e) {
		mapData.region = {
			latitude : e.latitude,
			longitude : e.longitude,
			latitudeDelta : e.latitudeDelta,
			longitudeDelta : e.longitudeDelta
		};
	});

	return mapView;
};

exports.getLL = function(e) {
	mapData.coords = {
		x : e.x,
		y : e.y,
	}

	mapData.source = e.source;

	var ll = llFromPixelXY(mapData);

	return ll;
}

var llFromPixelXY = function(mapData) {
  var mapView = mapData.source;
  
	var MERCATOR_OFFSET = 268435456;
	var MERCATOR_RADIUS = 85445659.44705395;

	var size = mapView.getSize();

	var region = mapData.region;

	var centerPixelX = Math.round(MERCATOR_OFFSET + MERCATOR_RADIUS * region.longitude * Math.PI / 180.0);
	var topLeftPixelX = Math.round(MERCATOR_OFFSET + MERCATOR_RADIUS * (region.longitude - region.longitudeDelta / 2) * Math.PI / 180.0);

	var scaledMapWidth = (centerPixelX - topLeftPixelX) * 2;

	var zoomScale = scaledMapWidth / size.width;
	var zoomExponent = Math.log(zoomScale) / Math.log(2);
	var zoom = 21 - zoomExponent

	var centerLat = region.latitude;
	var centerLon = region.longitude;

	var sinLatitudeCenter = Math.sin(centerLat * Math.PI / 180);

	var pixelXCenter = ((centerLon + 180) / 360) * 256 * Math.pow(2, zoom);
	var pixelYCenter = (0.5 - Math.log((1 + sinLatitudeCenter) / (1 - sinLatitudeCenter)) / (4 * Math.PI)) * 256 * Math.pow(2, zoom);
	var topLeftPixelX = pixelXCenter - (size.width / 2);
	var topLeftPixelY = pixelYCenter - (size.height / 2);
	var x = topLeftPixelX + mapData.coords.x;
	var y = topLeftPixelY + mapData.coords.y;

	var longitude = ((x * 360) / (256 * Math.pow(2, zoom))) - 180;
	var efactor = Math.exp((0.5 - y / 256 / Math.pow(2, zoom)) * 4 * Math.PI);
	var latitude = Math.asin((efactor - 1) / (efactor + 1)) * 180 / Math.PI;

	var data = {
		longitude : longitude,
		latitude : latitude
	}

	return data;
};
