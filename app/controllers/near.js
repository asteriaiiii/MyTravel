
function recevierNear(obj) {
	try {
		// var types = Titanium.App.Properties.getString("types");
		// var metric = Titanium.App.Properties.getString("metric");
		var types=obj.types;
		var metric=obj.metric;
		var	lat = obj.latitude;
		var	lng = obj.longitude;
		if (types == "null" && metric == "null") {

		} else {
			Titanium.App.Properties.setString("googlePlacesAPIKey", "AIzaSyBirGBefJkUInC53m7ZyPgeqYa2-x-CpEo");
			Alloy.createController('places').getData(lat, lng, metric, types, '', 'false', function(response) {
				if (response.status == "OK") {
					for (var i = 0; i < response.results.length; i++) {
						/*
						 $.map.addAnnotation(Ti.Map.createAnnotation({
						 animate : true,
						 pincolor : Titanium.Map.ANNOTATION_GREEN,
						 title : response.results[i].name,
						 latitude : response.results[i].geometry.location.lat,
						 longitude : response.results[i].geometry.location.lng,
						 leftButton : '/images/appicon.png'
						 }));*/
						Alloy.createController('places').getPlaceDetails(response.results[i].reference, 'false', function(response) {
							obj.map.addAnnotation(Ti.Map.createAnnotation({
								animate : true,
								title : response.result.name,
								subtitle : "Adress: " + response.result.formatted_address,
								latitude : response.result.geometry.location.lat,
								longitude : response.result.geometry.location.lng,
								image:"/images/places.png"
							}));
						}, function(e) {

						});

					}
					// $.map.setLocation({
						// latitude : response.results[response.results.length - 1].geometry.location.lat,
						// longitude : response.results[response.results.length - 1].geometry.location.lng,
						// latitudeDelta : 0.1,
						// longitudeDelta : 0.1
					// });

				}
			}, function(e) {
				
			});
		}

	} catch(err) {
	}
}
exports.recevierNear=recevierNear;
//=================================Dialog input metric===========================================
function inputMetric() {
	var metric = Ti.UI.createTextField();

	var dialog = Ti.UI.createOptionDialog({
		title : "Input radius",
		androidView : metric,
		buttonNames : ['Ok', 'Cancel']
	});

	dialog.addEventListener('click', function(e) {
		if (e.index == 0) {// we read it only if get it is pressed
			Titanium.App.Properties.setString("metric", metric.value);
			$.nearPlace.close();
			Alloy.createController('index').getView().open();
		}

	});
	dialog.show();

}
//=================================Control button click===========================================
//=================================Window===========================================

