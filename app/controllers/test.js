function clickAudio(e) {

	if ($.txtLat.value != '' && $.txtLng.value != '') {
		var obj = {
			lat : $.txtLat.value,
			lng : $.txtLng.value
		};
		try{
			Alloy.createController('databasepoint').reviewDataPoint(obj);
		}
		catch(err)
		{
			alert("Not found");
		}
	}

}

$.idTest.addEventListener('android:back', function(e) {
	$.idTest.close();
	Alloy.createController('index').getView().open();
});
$.idTest.open();
