//======================================================================
// ExCL is an open source mobile platform for museums that feature basic 
// museum information and extends visitor engagement with museum exhibits. 
// Copyright (C) 2014  Children's Museum of Houston and the Regents of the 
// University of California.
// 
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//=====================================================================

var args = arguments[0] || {};

var json;
var doneLoading = false;

var url = Alloy.Globals.rootWebServiceUrl;
var cache = require('remoteDataCache');
var dataRetriever = setPathForLibDirectory('dataRetriever/dataRetriever');
var loadingSpinner = setPathForLibDirectory('loadingSpinner/loadingSpinner');
var spinnerLib = new loadingSpinner();
var spinner = spinnerLib.getSpinner();
var loadingSpinnerView = Ti.UI.createView();
var loadingSpinnerDarkView = Ti.UI.createView({ backgroundColor: Alloy.CFG.excl.colors.loadingSpinnerTintColor, opacity: 0.5 });
loadingSpinnerView.add(loadingSpinnerDarkView);
var iconService = setPathForLibDirectory('customCalls/iconService');
iconService = new iconService();

var detectDevice = setPathForLibDirectory('customCalls/deviceDetectionService');
detectDevice = new detectDevice();

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
		if (json.data.museum.exhibits !== false) {
			addSpinner();
			var controller = Alloy.createController("exhibitLanding", eval([json]));
			controller.setAnalyticsPageTitle("Exhibit Landing");
			Alloy.Globals.navController.open(controller);
			hideSpinner();
		} else {
			alert("There isn't any content yet! We'll be adding some soon.");
		}
	}
}

function openMap() {
	if(doneLoading){
		addSpinner();
		var controller = Alloy.createController("map", eval([json]));
		Alloy.Globals.navController.open(controller);
		hideSpinner();
	}
}

function openInfo() {
	if(doneLoading){
		addSpinner();
		var controller = Alloy.createController("info", eval([json]));
		Alloy.Globals.navController.open(controller);
		hideSpinner();
	}
}

function addSpinner(){
	loadingSpinnerView.add(spinner);
	spinner.show();
	$.home.add(loadingSpinnerView);
}

function hideSpinner(){
	spinner.hide();
	$.home.remove(loadingSpinnerView);
}

function retrieveJson(jsonURL) {
	json = Alloy.Globals.museumJSON;
	var museum = json.data.museum;

	var jsonExhibitsLabel = museum.homepage_exhibits_label;
	if(jsonExhibitsLabel) $.exhibitsLabel.text = jsonExhibitsLabel;
	
	var jsonMapLabel = museum.homepage_map_label;
	if(jsonMapLabel) $.mapLabel.text = jsonMapLabel;
	
	var jsonInfoLabel = museum.homepage_info_label;
	if(jsonInfoLabel) $.infoLabel.text = jsonInfoLabel;
	
	var jsonIconUrl = museum.homepage_icon;
	cache.getFile({
		url: jsonIconUrl,
		onsuccess: function(filePath, request) {
			$.iconLink.image = filePath;
		},
		onerror: function(request) {
			$.iconLink.image = iconService.getImageFilename("development.jpg");
		}
	});
	doneLoading = true;
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
		//"fontFamily" : 'KGSummerSunshineShadow'
		fontWeight : "bold",
		fontFamily: Alloy.CFG.excl.defaultGlobalFontFamily
	};
	

	if (detectDevice.isTablet()){		
		font["fontSize"] = "85dp";
		$.exhibitsLabel.font = font;
		$.mapLabel.font = font;
		$.infoLabel.font = font;

	} else {
		font["fontSize"] = "45dp";
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

var reload = function(callback){
	doneLoading = false;
	url = Alloy.Globals.rootWebServiceUrl;
	retrieveJson(url);
	Alloy.Globals.navController.openTutorial(this);
	if(callback && typeof callback === 'function') callback();
};

init();

// This is how you export functions/members from index
this.reload = reload;

Alloy.Globals.navController.open(this);
