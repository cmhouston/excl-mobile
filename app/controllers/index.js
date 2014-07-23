var args = arguments[0] || {};

var json;
var doneLoading = false;

var url = Alloy.Globals.rootWebServiceUrl;
var dataRetriever = setPathForLibDirectory('dataRetriever/dataRetriever');
var loadingSpinner = setPathForLibDirectory('loadingSpinner/loadingSpinner');
var spinner = new loadingSpinner();
/**
 * Analytics Specific Data
 */
var analyticsPageTitle = "Home";
var analyticsPageLevel = "Home";

function setAnalyticsPageTitle(title) {
	analyticsPageTitle = title;
}

function getAnalyticsPageTitle() {
	return analyticsPageTitle;
}

function setAnalyticsPageLevel(level) {
	analyticsPageLevel = level;
}

function getAnalyticsPageLevel() {
	return analyticsPageLevel;
}

this.setAnalyticsPageTitle = setAnalyticsPageTitle;
this.getAnalyticsPageTitle = getAnalyticsPageTitle;
this.setAnalyticsPageLevel = setAnalyticsPageLevel;
this.getAnalyticsPageLevel = getAnalyticsPageLevel;
//------------------------------------------------

function setPathForLibDirectory(libFile) {
	if ( typeof Titanium == 'undefined') {
		lib = require("../../lib/" + libFile);
	} else {
		lib = require(libFile);
	}
	return lib;
};

function openExhibits() {
	addSpinner();
	if(doneLoading){
		var controller = Alloy.createController("exhibitLanding", eval([json]));
		controller.setAnalyticsPageTitle("Exhibit Landing");
		Alloy.Globals.navController.open(controller);
	}else
	{
		alert("Not Done Loading");
	}
	hideSpinner();
}

function addSpinner(){
	spinner.addTo($.index);
	spinner.show();
}

function hideSpinner(){
	spinner.hide();
}

function openMap() {
	if(doneLoading){
		var controller = Alloy.createController("map", eval([json]));
		Alloy.Globals.navController.open(controller);
	}else
	{
		alert("Not Done Loading");
	}
}

function openInfo() {
	if(doneLoading){
		var controller = Alloy.createController("info", eval([json]));
		Alloy.Globals.navController.open(controller);
	}else
	{
		alert("Not Done Loading");
	}
}

function retrieveJson(jsonURL) {
	dataRetriever.fetchDataFromUrl(jsonURL, function(returnedData) {
		if (returnedData) {
			json = returnedData;
			var museum = json.data.museum;

			var jsonExhibitsLabel = museum.homepage_exhibits_label;
			if(jsonExhibitsLabel) $.exhibitsLabel.text = jsonExhibitsLabel;
			
			var jsonMapLabel = museum.homepage_map_label;
			if(jsonMapLabel) $.mapLabel.text = jsonMapLabel;
			
			var jsonInfoLabel = museum.homepage_info_label;
			if(jsonInfoLabel) $.infoLabel.text = jsonInfoLabel;
			
			var jsonIconUrl = museum.homepage_icon;
			if(jsonIconUrl) $.iconLink.image = jsonIconUrl;
			
			doneLoading = true;
		}
	});
}

function enableMenuButtons() {
	$.exhibitsLink.addEventListener("click", function() {
		openExhibits();
	});
	$.mapLink.addEventListener("click", function() {
		openMap();
	});
	$.infoLink.addEventListener("click", function() {
		openInfo();
	});
}

function formatObjectSizes() {
	var font = {
		"fontFamily" : 'KGSummerSunshineShadow'
	};

	if (Titanium.Platform.osname == "ipad"){		
		font["fontSize"] = "70dp";
		$.exhibitsLabel.font = font;
		$.mapLabel.font = font;
		$.infoLabel.font = font;

	} else {
		font["fontSize"] = "35dp";
		$.exhibitsLabel.font = font;
		$.mapLabel.font = font;
		$.infoLabel.font = font;
	}
}

function init(){
	retrieveJson(url);
	formatObjectSizes();
	enableMenuButtons(); 
}

var reload = function(){
	doneLoading = false;
	url = Alloy.Globals.rootWebServiceUrl;
	retrieveJson(url);
};

init();

// This is how you export functions/members form index
this.reload = reload;

Alloy.Globals.navController.open(this);
