exports.createGrid = function(args) {
	var params = args || {};
	//Ti.API.info('Params es ---> '+ JSON.stringify(params));

	var columns = params.columns || 4;
	var space = params.space || 5;
	var data = params.data || {};
	var options = params.params || {};
	var layout = params.layout || 'gallery';
	var screenWidth = params.width || Ti.Platform.displayCaps.getPlatformWidth();
	var newWidth = screenWidth - space;
	var columnWidth = (newWidth / columns) - space;
	var frameBGcolor = options.backgroundColor || '#fff';

	//ADJUST THE SCROLLVIEW
	$.fgScrollView.left = space;
	$.fgScrollView.top = space;
	$.fgScrollView.right = -1;

	$.fgMain.backgroundColor = frameBGcolor;

	for (var x = 0; x < data.length; x++) {

		var frame = Ti.UI.createView({
			width : columnWidth,
			height : columnWidth,
			borderRadius : 10,
			backgroundColor : '#fff',
			top : 0,
			left : 0,
			right : space,
			bottom : space
		});

		var overlay = Ti.UI.createView({
			width : Ti.UI.FILL,
			height : Ti.UI.FILL,
			backgroundColor : 'transparent',
			zIndex : x,
			strImage : data[x].image,
			strCoin : data[x].title
		});

		var gridElement;

		//TYPE OF LAYOUT
		switch(layout) {
			case('gallery'):

				gridElement = Widget.createController('gallery', {
					image : data[x].image,
					title : data[x].title,
					width : columnWidth,
					padding : options.padding || 10,
					showTitle : options.showTitle || false
				}).getView();

				overlay.addEventListener('click', function(e) {
					var data=Titanium.App.Properties.getObject("data");
					alert(e.source.strImage);
					params.map.addAnnotation(Ti.Map.createAnnotation({
						animate : true,
						pincolor : Titanium.Map.ANNOTATION_RED,
						title : "My Location",
						latitude : data.latitude,
						longitude : data.longitude,
						image : e.source.strImage
					}));
					//---------------------- Not eng0ough coins------------------//
					// var overlay = Ti.UI.createView({
					// width : Ti.UI.FILL,
					// height : Ti.UI.FILL,
					// backgroundColor : '#eee',
					// opacity : 0,
					// zIndex : 100
					// });
					//
					// var topView = Ti.UI.createView({
					// width : Ti.UI.FILL,
					// height : Ti.UI.FILL,
					// zIndex : 1200,
					// visible : false
					// });
					// var notImage = Titanium.UI.createAlertDialog({
					// title : 'Selected image traffic!',
					// message : 'Are you sure?',
					// buttonNames : [ 'Cancel','Yes'],
					// cancel : 0
					// });
					//
					// notImage.addEventListener('click', function(e) {
					// if (e.cancel === e.index || e.cancel === true) {
					// return false;
					// }
					// if (e.index === 1) {
					// alert("Operation add image location map view here");
					// }
					// if (e.index === 0) { }
					// });
					// notImage.show();
					// topView.add(notImage);
					// $.fgMain.add(notImage);
				});
				break;
		}

		frame.add(gridElement);
		frame.add(overlay);
		$.fgScrollView.add(frame);
	};
};
exports.clearGrid = function() {
	$.fgScrollView.removeAllChildren();
};
