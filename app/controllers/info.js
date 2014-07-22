var args = arguments[0] || {};

var url = Alloy.Globals.rootWebServiceUrl;

var analyticsPageTitle = "Info";
var analyticsPageLevel = "Information";

var setAnalyticsPageTitle = function(title) {
	analyticsPageTitle = title;
};
var getAnalyticsPageTitle = function() {
	return analyticsPageTitle;
};
var setAnalyticsPageLevel = function(level) {
	analyticsPageLevel = level;
};
var getAnalyticsPageLevel = function() {
	return analyticsPageLevel;
};

$.onEnterKioskMode = function() {
	$.navBar.onEnterKioskMode();
};

$.onExitKioskMode = function() {
	$.navBar.onExitKioskMode();
};

$.navBar.setPageTitle("Info");

Ti.API.info(JSON.stringify(args[0]));

// function insertInfoPicture() {
// 
	// var view = Titanium.UI.createView({
		// height : '100%',
		// left : '6dip',
		// right : '6dip',
		// top : '10dip',
		// bottom : '20dip',
		// layout : 'vertical'
	// });
// 
	// var image = Ti.UI.createImageView({
		// image : "/images/MuseumInfoNoMember.jpg",
		// backgroundColor:'transparent', 
		// width : '100%',
		// height : '100%'
	// });
// 	
	// image.addEventListener('pinch', function(e) { 
		// var t = Ti.UI.create2DMatrix().scale(e.scale); 
		// image.transform = t; 
		// });
// 
	// view.add(image);
// 
	// $.scrollView.add(view);
	// $.scrollView.height = "auto";
// 
// }
// 
// insertInfoPicture();

