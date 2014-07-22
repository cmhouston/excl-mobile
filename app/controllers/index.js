var args = arguments[0] || {};

var json;
var doneLoading = false;

var url = Alloy.Globals.rootWebServiceUrl;
var dataRetriever = setPathForLibDirectory('dataRetriever/dataRetriever');

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
	if(doneLoading){
		var controller = Alloy.createController("exhibitLanding", eval([json]));
		controller.setAnalyticsPageTitle("Exhibit Landing");
		Alloy.Globals.navController.open(controller);
	}else
	{
		alert("Not Done Loading");
	}
}

function openMap() {
	if(doneLoading){
		var controller = Alloy.createController("map");
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
			var museums = Alloy.Collections.instance('museum');
			var museumModel = Alloy.createModel('museum');
			var page_info = json.data.museum.info;
			museumModel.set({
				'info' : museums.info,
			});
			museums.add(museumModel);	
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
