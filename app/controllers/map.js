var args = arguments[0] || {};

var analyticsPageTitle = "Map";
var analyticsPageLevel = "Information";

var url = Alloy.Globals.rootWebServiceUrl;

var json = args[0];

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
exports.setAnalyticsPageTitle = setAnalyticsPageTitle;
exports.getAnalyticsPageTitle = getAnalyticsPageTitle;
exports.setAnalyticsPageLevel = setAnalyticsPageLevel;
exports.getAnalyticsPageLevel = getAnalyticsPageLevel;

$.navBar.setPageTitle("Map");

function insertInfoPicture() {

	var view = Titanium.UI.createView({
		height : '100%',
		left : '6dip',
		right : '6dip',
		top : '10dip',
		bottom : '20dip',
		layout : 'vertical'
	});

	var image = Ti.UI.createImageView({
		image : "http://excl.dreamhosters.com/dev/wp-content/uploads/2014/06/cmhmap.png",
		backgroundColor:'transparent', 
		width : '100%',
		height : '100%'
	});
	
	// image.addEventListener('pinch', function(e) { 
		// var t = Ti.UI.create2DMatrix().scale(e.scale); 
		// image.transform = t; 
		// });

	view.add(image);

	$.mapView.add(image);
	//$.mapView.height = "auto";

}

insertInfoPicture();

//$.mapImage.html = json.data.museum.map;

$.onEnterKioskMode = function() {
	$.navBar.onEnterKioskMode();
};

$.onExitKioskMode = function() {
	$.navBar.onExitKioskMode();
};