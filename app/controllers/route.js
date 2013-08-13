//============================================Decode line============================================
function decodeLine(encoded) {
	var len = encoded.length;
	var index = 0;
	var array = [];
	var lat = 0;
	var lng = 0;

	while (index < len) {
		var b;
		var shift = 0;
		var result = 0;
		do {
			b = encoded.charCodeAt(index++) - 63;
			result |= (b & 0x1f) << shift;
			shift += 5;
		} while (b >= 0x20);

		var dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
		lat += dlat;

		shift = 0;
		result = 0;
		do {
			b = encoded.charCodeAt(index++) - 63;
			result |= (b & 0x1f) << shift;
			shift += 5;
		} while (b >= 0x20);

		var dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
		lng += dlng;

		array.push([lat * 1e-5, lng * 1e-5]);
	}

	return array;

}

var points = [];
var data = Alloy.createController('databasetravel');
function addRoute(obj) {
	var xhr = Ti.Network.createHTTPClient();
	xhr.onload = function(e) {
		var response = this.responseText;
		var json = JSON.parse(response);
		var step = json.routes[0].legs[0].steps;
		//=======================Display==============================
		obj.lblAB.setVisible(true);
		obj.lblAB.setHtml("<font color='green'>From:</font>" + json.routes[0].legs[0].start_address + "<br/>" + "<font color='red'>To:</font>" + json.routes[0].legs[0].end_address + "<br/>" + "<font color='green'>Distance: </font>" + json.routes[0].legs[0].distance.text + "<br/><font color='green'>Duration: </font>" + json.routes[0].legs[0].duration.text);

		//================Instructions=========================
		var intStep = 0, intSteps = step.length;
		var decodedPolyline, intPoint = 0, intPoints = 0;
		obj.map.addAnnotation(Ti.Map.createAnnotation({
			animate : true,
			pincolor : Titanium.Map.ANNOTATION_DRAG_STATE_START,
			title : "Start",
			latitude : step[0].start_location.lat,
			longitude : step[0].start_location.lng,
			//leftButton : '/images/appicon.png',
			image : "http://maps.gstatic.com/mapfiles/place_api/icons/cafe-71.png",
		}));
		var objdata = [];

		data.createDataTravel("location");
		for ( intStep = 0; intStep < intSteps; intStep = intStep + 1) {
			//=======================Save data==============================
			objdata = [step[intStep].maneuver, step[intStep].end_location.lat, step[intStep].end_location.lng];
			data.insertDataTravel(objdata, 'location');
			//=======================Draw route==============================
			obj.map.addAnnotation(Ti.Map.createAnnotation({
				animate : true,
				title : step[intStep].html_instructions,
				latitude : step[intStep].end_location.lat,
				longitude : step[intStep].end_location.lng
			}));
			if (intStep == intSteps - 1) {
				obj.map.addAnnotation(Ti.Map.createAnnotation({
					animate : true,
					title : step[intStep].html_instructions,
					latitude : step[intStep].end_location.lat,
					longitude : step[intStep].end_location.lng,
					//leftButton : '/images/appicon.png'
					image : "/images/marker_greenB.png"
				}));
				obj.map.setLocation({
					latitude : step[intStep].end_location.lat,
					longitude : step[intStep].end_location.lng,
					latitudeDelta : 0.01,
					longitudeDelta : 0.01
				});
			}

			decodedPolyline = decodeLine(step[intStep].polyline.points);
			intPoints = decodedPolyline.length;
			for ( intPoint = 0; intPoint < intPoints; intPoint = intPoint + 1) {
				if (decodedPolyline[intPoint] != null) {
					points.push({
						latitude : decodedPolyline[intPoint][0],
						longitude : decodedPolyline[intPoint][1]
					});
				}
			}
			points.push({
				latitude : step[intStep].end_location.lat,
				longitude : step[intStep].end_location.lng
			});
		}

		var route = {
			name : 'Route',
			points : points,
			color : 'green',
			width : 4
		};
		obj.map.addRoute(route);
		return points;
	};
	xhr.onerror = function(e) {
		alert("Error");
		Ti.API.info('error', JSON.stringify(e));
		return points;
	};
	var param = ['destination=' + obj.stop, 'origin=' + obj.start, 'region=' + obj.region, "mode=" + obj.travel_mode, "units=" + obj.units, 'sensor=false'];
	xhr.open('GET', 'http://maps.googleapis.com/maps/api/directions/json?' + param.join('&'));
	xhr.send();
	return points;
}

exports.addRoute = addRoute;
var timer = null;
var i = 1;
var annotation;
var objNear
function drawAnnotation(lbl, map, obj) {
	map.removeAllAnnotations();
	timer = setInterval(function(e) {
		annotation = Ti.Map.createAnnotation({
			animate : false,
			latitude : obj[i].latitude,
			longitude : obj[i].longitude,
			image : "/images/traffic/arrow.png",
			title : "MyLocationAtThemoment"
		});
		objNear = {
			types : 'cafe',
			metric : '500',
			map : map,
			latitude:obj[i].latitude,
			longitude:obj[i].longitude
		};
		setTimeout(function() {

			map.addAnnotation(annotation);
			map.setLocation({
				latitude : obj[i].latitude,
				longitude : obj[i].longitude,
				latitudeDelta : 0.01,
				longitudeDelta : 0.01
			});
			Alloy.createController('near').recevierNear(objNear);
		}, 50);
		i++;
		map.removeAnnotation(annotation.getTitle());
		if (i == obj.length - 2) {
			i = 1;
		}
	}, 1000);
}

exports.drawAnnotation = drawAnnotation;
function stopDrawAnnotation(obj, points) {
	var dataLocation = [];
	var dataIntruction;
	var stop, start;
	dataLocation = data.reviewDataTableGetAllLocation();
	//if (dataLocation[v].pointX == points[i].latitude && dataLocation[v].pointY == points[i].latitude) {
	stop = points[i].latitude + "," + points[i].longitude;
	start = points[0].latitude + "," + points[0].longitude;
	//}
	var objInstruction = {
		pointX : points[i].latitude,
		pointY : points[i].longitude
	};
	dataIntruction = data.reviewDataTableGetIntruction(objInstruction);
	var txtIntruction;
	if (dataIntruction.search("left") == 0) {
		txtIntruction = "Turn left";
		data.play("/audio/1.mp3");
	} else if (dataIntruction.search("right") == 0) {
		txtIntruction = "Turn right";
		data.play("/audio/2.mp3");
	} else if (dataIntruction.search("null") == 0 || dataIntruction.search("straight") == 0) {
		txtIntruction = "Straight";
		data.play("/audio/3.mp3");
	}
	if (timer != null) {
		clearInterval(timer);

		var xhr = Ti.Network.createHTTPClient();
		xhr.onload = function(e) {
			var response = this.responseText;
			var json = JSON.parse(response);
			var step = json.routes[0].legs[0].steps;
			//=======================Display==============================
			obj.lblAB.setVisible(true);
			obj.lblAB.setHtml("<font color='green'>From:</font>" + json.routes[0].legs[0].start_address + "<br/>" + "<font color='red'>To:</font>" + json.routes[0].legs[0].end_address + "<br/>" + "<font color='green'>Distance Actual: </font>" + json.routes[0].legs[0].distance.text + "<br/><font color='green'>Duration: </font>" + json.routes[0].legs[0].duration.text + "<br/><font color='green'>Distance Straight:</font>" + getDistanceFromLatLonInKm(points[0].latitude, points[0].longitude, points[i].latitude, points[i].longitude) + " km" +"<br/><font color='green'>Instruction: </font>" + txtIntruction);
			obj.map.removeAnnotation(annotation.getTitle());
			obj.map.addAnnotation(Ti.Map.createAnnotation({
				animate : true,
				title : "Stop here",
				latitude : points[i].latitude,
				longitude : points[i].longitude,
				image : "/images/marker_greenB.png"
			}));

		};
		xhr.onerror = function(e) {
			alert("Error");
			Ti.API.info('error', JSON.stringify(e));
			return points;
		};
		var param = ['destination=' + stop, 'origin=' + start, 'region=' + obj.region, "mode=" + obj.travel_mode, "units=" + obj.units, 'sensor=false'];
		xhr.open('GET', 'http://maps.googleapis.com/maps/api/directions/json?' + param.join('&'));
		xhr.send();

	}

}

//======================================Get Km A->B Line=====================================
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
	var R = 6371;
	// Radius of the earth in km
	var dLat = deg2rad(lat2 - lat1);
	// deg2rad belowf
	var dLon = deg2rad(lon2 - lon1);
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c;
	// Distance in km
	return d;
}

function deg2rad(deg) {
	return deg * (Math.PI / 180);
}

exports.getDistanceFromLatLonInKm = getDistanceFromLatLonInKm;
//=======================================Get Address from location============================
function getAddresFromLocation(objLocation) {
	var street = "null";
	var city;
	var country;
	Titanium.Yahoo.yql('select * from yahoo.maps.findLocation where q="' + objLocation.latitude + ',' + objLocation.longitude + '" and gflags="R"', function(e) {
		street = e.data.ResultSet.Results.woeid;
	});
	return street;
}

exports.stopDrawAnnotation = stopDrawAnnotation;
function onChangePicker(e) {

	Titanium.App.Properties.setString("start", $.txtStart.value);
	Titanium.App.Properties.setString("stop", $.txtStop.value);
	Titanium.App.Properties.setString("travel", e.row.title);
	$.winIntruction.close();
	Alloy.createController('index').getView().open();
}

$.winIntruction.addEventListener('android:back', function(e) {
	$.winIntruction.close();
	Alloy.createController('index').getView().open();
});
$.winIntruction.open();
