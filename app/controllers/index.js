//=============================Variable=============================================================
var lat, lng;
var route;
var pointsDraw = [];
var method = Alloy.createController('route');
var database = Alloy.createController('databasetravel');
//==============================================GetLocation===========================================
Titanium.Geolocation.getCurrentPosition(function(e) {
	$.map.region = {
		latitude : e.coords.latitude,
		longitude : e.coords.longitude,
		latitudeDelta : 0.01,
		longitudeDelta : 0.01
	};
	alert(e.coords.latitude+":"+ e.coords.longitude);
});
//==========================================Control button click=============================================
function locationClick() {
	Titanium.Geolocation.getCurrentPosition(function(e) {
		$.map.region = {
			latitude : e.coords.latitude,
			longitude : e.coords.longitude,
			latitudeDelta : 0.01,
			longitudeDelta : 0.01
		};

	});
	$.txtSearch.setVisible(false);
	$.btnSearch.setVisible(false);
	$.lblAB.setVisible(false);
	$.lblAB.setText("");
}

function searchChange(e) {
	if ($.txtSearch.value != "") {
		Alloy.createController('search').forwardGeocode($.txtSearch.value, function(geodata) {

			$.map.addAnnotation(Ti.Map.createAnnotation({
				animate : true,
				pincolor : Titanium.Map.ANNOTATION_RED,
				title : geodata.title.value,
				latitude : geodata.coords.latitude,
				longitude : geodata.coords.longitude
			}));
			$.map.setLocation({
				latitude : geodata.coords.latitude,
				longitude : geodata.coords.longitude,
				latitudeDelta : 0.01,
				longitudeDelta : 0.01
			});
		});
	}
}

//===========================================Map Route between two point and distance===========================
var coordxy = require('coordFromXY');
coordxy.watchMap($.map);
function mapClick(evt) {

	// try {
		// var point = [{
			// latitude : evt.latitude,
			// longitude : evt.longitude
		// }, {
			// latitude : lat,
			// longitude : lng
		// }];
		// route = {
			// name : evt.title,
			// width : 4,
			// color : "blue",
			// points : point
		// };
// 
		// $.map.addRoute(route);
		// $.lblAB.setVisible(true);
		// $.lblAB.setHtml("<font color='green'>Distance:</font>" + method.getDistanceFromLatLonInKm(evt.latitude, evt.longitude, lat, lng))
	// } catch(err) {
		// alert('error');
	// }
	// if (evt.clicksource == 'leftButton')
}

function mapLocationChange(e) {

}

function onPinChanged(e) {

}

function mapLongpress(e) {
	data = coordxy.getLL(e);
	Titanium.App.Properties.setObject("data", data);
	$.map.addAnnotation(Ti.Map.createAnnotation({
		animate : true,
		pincolor : Titanium.Map.ANNOTATION_RED,
		latitude : data.latitude,
		longitude : data.longitude
	}));
	if ($.viewIcon.getVisible() == false) {
		$.viewIcon.setVisible(true);
		imageIconGallery();
	}
}

//======================================= Control Menu click======================================================
function menuSearchClick(e) {
	$.txtSearch.setVisible(true);
	$.btnSearch.setVisible(true);
	$.lblAB.setVisible(false);
	$.lblAB.setText("");
}

function menuRouteClick(e) {
	$.main.close();
	Alloy.createController('route').getView().open();
}

function menuNearClick(e) {

	$.main.close();
	Alloy.createController('near').getView().open();
	// Ti.API.info("Menu item clicked: " + e.source.title);

}

function menuTestAudioLocationClick(e) {
	$.main.close();
	// Alloy.createController('test').getView().open();
}

//==============================receiver route====================================================================
function recevierRoute() {
	try {
		// var start = Titanium.App.Properties.getString("start");
		// var stop = Titanium.App.Properties.getString("stop");
		// var travel = Titanium.App.Properties.getString("travel");
		var start = 'ha dinh';
		var stop = 'ho guom';
		var travel = 'driving';
		if (start == "null" && stop == "null") {

		} else {
			method.addRoute({
				lblAB : $.lblAB,
				map : $.map,
				start : start,
				stop : stop,
				travel_mode : travel,
				units : 'metric'
			});
		}

	} catch(err) {

	}
	Titanium.App.Properties.setString("start", "null");
	Titanium.App.Properties.setString("stop", "null");

}

//==============================Display instruction=================================
function lblIntruction(e) {
	Alloy.createController('instructions').getView().open();
}
//==============================CheckAudo, emulator, positions================================
function deleterouteClick(e) {
	if (route != null) {

		$.map.removeRoute(route);

	}
}

var audioPlayer;
function getPlayMP3Click(e) {
	audioPlayer = Titanium.Media.createAudioPlayer({
		url : "/audio/tlt.mp3",
		allowBackground : true,
		volume : 1

	});
	if (audioPlayer.playing || audioPlayer.paused) {
		audioPlayer.stop();
		if (Ti.Platform.name === 'android') {
			audioPlayer.release();
		}
	} else {
		audioPlayer.start();
	}
}

function getStopMp3Click(e) {

	audioPlayer.stop();
}

function incrementClick(e) {
	var dataLocation = [];
	dataLocation = database.reviewDataTableGetAllLocation();
	for (var i = 0; i < dataLocation.length; i++) {
		alert(dataLocation[i].instruction + "\n" + dataLocation[i].pointX + "\n" + dataLocation[i].pointY);

	}

}

function stopClick(e) {
	var obj = {
		map : $.map,
		lblAB : $.lblAB,
		travel_mode : "driving",
		units : 'metric'
	};
	method.stopDrawAnnotation(obj, pointsDraw);

}

function startClick(e) {

	method.drawAnnotation($.lblAB, $.map, pointsDraw);
}

function getRouteClick(e) {
	var view = Ti.UI.createView({
		layout : "vertical"
	});
	var pointA = Ti.UI.createTextField({
		width : Ti.UI.FILL,
		hintText : "INPUT ADDRESS A",
		value : "ha dinh"
	});
	var pointB = Ti.UI.createTextField({
		width : Ti.UI.FILL,
		hintText : "INPUT ADDRESS B",
		value : "ho guom"
	});
	view.add(pointA);
	view.add(pointB);
	var dialog = Ti.UI.createOptionDialog({
		title : "Input A->B",
		androidView : view,
		buttonNames : ['Ok', 'Cancel']
	});

	dialog.addEventListener('click', function(e) {
		if (e.index == 0) {// we read it only if get it is pressed
			pointsDraw = method.addRoute({
				lblAB : $.lblAB,
				map : $.map,
				start : pointA.value,
				stop : pointB.value,
				travel_mode : "driving",
				units : 'metric'
			});
		}

	});
	dialog.show();
}

//==============================Display icon========================================
var items = [{
	title : 'Type 1',
	image : '/images/traffic/image1.png'
}, {
	title : 'Type 2',
	image : '/images/traffic/image2.png'
}, {
	title : 'Type 2',
	image : '/images/traffic/image3.png'
}, {
	title : 'Type 3',
	image : '/images/traffic/image4.png'
}];
function imageIconGallery() {
	setTimeout(function() {
		$.fg.createGrid({
			map : $.map,
			columns : 3,
			space : 10,
			data : items,
			layout : 'gallery',
			params : {
				padding : 10,
				showTitle : false,
				backgroundColor : '#eee',
				gridColor : '#ccc'
			},
			width : $.main.size.width	//OPTIONAL. SCREEN'S WIDTH TO ADJUST GRID.
		});
	}, 800);

}

//=================================event main=======================================
Ti.Gesture.addEventListener('orientationchange', function(e) {
	var orientation = e.orientation;
	if (orientation < 1 || orientation > 4) {
		return;
	} else if (orientation == 1) {
		$.fg.clearGrid();
		var params = {
			columns : 3,
			space : 10,
			data : items,
			layout : 'gallery',
			params : {
				padding : 10,
				showTitle : false,
				backgroundColor : '#eee',
				gridColor : '#ccc'
			},
			width : $.main.size.width,
			map : $.map
		};
		$.fg.createGrid(params);
	} else if (orientation == 2) {
		$.fg.clearGrid();
		var params = {
			map : $.map,
			columns : 4,
			space : 10,
			data : items,
			layout : 'gallery',
			params : {
				padding : 10,
				showTitle : false,
				backgroundColor : '#eee',
				gridColor : '#ccc'
			},
			width : $.main.size.width
		};
		$.fg.createGrid(params);
	}
});
$.main.open();
