var args = arguments[0]||{};

var the_image = args.image || '';
var theWidth = args.width || '95%';
var thePadding = args.padding || 10;
var showTitle = args.showTitle || false;
var theTitle = args.title || '';


	$.fgThumb.width = theWidth - thePadding;
	$.fgThumb.height = theWidth * 0.70;
	$.fgThumb.top = thePadding / 2;
	
	$.fgImage.image = createThumb(the_image, theWidth - thePadding);
	$.fgImage.width = theWidth - thePadding;
	$.fgImage.height = theWidth * 0.70;
	
	var titleView = Ti.UI.createView({
		width:Ti.UI.FILL,
		height:Ti.UI.FILL,
		backgroundColor:'transparent'
	});
	
	var title = Ti.UI.createLabel({
		text:theTitle,
		width:Ti.UI.FILL,
		height:Ti.UI.SIZE,
		textAlign:'center',
		color:'#000',
	 	font:{fontSize:'15sp', fontFamily:'Caviar Dreams'}
	});
	titleView.add(title);
	$.fgMainView.add(titleView);


function createThumb(image,size) {
	if (OS_IOS){ 
	  var imageView = Ti.UI.createImageView({
	    image: image,
	    width: Ti.UI.SIZE,
	    height: Ti.UI.SIZE,
	    hires:true
	  });
	  return imageView.toImage().imageAsThumbnail(size * 2,0,0);
	} 
  	else{
  		return image;
  	}
}
