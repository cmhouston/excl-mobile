// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

var NavigationController = require('navigationService/NavigationController');
Alloy.Globals.navController = new NavigationController();

var AnalyticsController = require('analyticService/analyticService');
Alloy.Globals.analyticsController = new AnalyticsController();

var AdminModeController = require('adminModeService/AdminModeController');
Alloy.Globals.adminModeController = new AdminModeController();

var StorageService = require('storageService/storageService');
Alloy.Globals.storageService = new StorageService();

// The urls for Development, Quality Assurance, and Production
var rootWebServiceUrls = {
	"dev": 		"http://excl.dreamhosters.com/dev/wp-json/v01/excl/museum/81",
	"qa": 		"http://excl.dreamhosters.com/qa/wp-json/v01/excl/museum/81",
	"prod": 	"http://excl.dreamhosters.com/prod/wp-json/v01/excl/museum/81"
};

Alloy.Globals.isInDefaultWordpressEnviroment = function(){
	return this.rootWebServiceUrl == rootWebServiceUrls["prod"];
};

Alloy.Globals.setRootWebServiceFromUrls = function(key){
	if( rootWebServiceUrls[key] )
		Alloy.Globals.setRootWebServiceUrl(rootWebServiceUrls[key]);
};

Alloy.Globals.setRootWebServiceUrl = function(url){
	if( url ) {
		Alloy.Globals.rootWebServiceUrl = url;
		Alloy.Globals.storageService.setStringProperty("rootWebServiceURL", url);
	}
};

if (Alloy.Globals.storageService.getStringProperty("rootWebServiceURL")) {
	Alloy.Globals.setRootWebServiceUrl(Alloy.Globals.storageService.getStringProperty("rootWebServiceURL"));
} else {
	Alloy.Globals.setRootWebServiceFromUrls("prod");
}

Alloy.Globals.setPathForLibDirectory = function(libFile){
	if ( typeof Titanium == 'undefined') {
		lib = require("../../lib/" + libFile);
	} else {
		lib = require(libFile);
	}
	return lib;
};

Alloy.Globals.isNumber = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

Alloy.Globals.isAlpha = function(ch){
	return ch.search(/[^A-Za-z\s]/) == -1;
};

Alloy.Globals.rotate180 = Ti.UI.create2DMatrix().rotate(-180);
Alloy.Globals.rotate90 = Ti.UI.create2DMatrix().rotate(90);

// do not remove: initialization of global backbone models
Alloy.Models.app = Alloy.Models.instance('app');
Alloy.Collections.filter = Alloy.Collections.instance('filter');
Alloy.Models.app.retrieveMuseumData();


