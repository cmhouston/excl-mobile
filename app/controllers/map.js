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
var analyticsPageTitle = "Map";
var analyticsPageLevel = "Information";
var url = Alloy.Globals.rootWebServiceUrl;
var json = Alloy.Globals.museumJSON;

function setPathForLibDirectory(libFile) {
	if ( typeof Titanium == 'undefined') {
		lib = require("../../lib/" + libFile);
	} else {
		lib = require(libFile);
	}
	return lib;
};

var cache = require('remoteDataCache');
var loadingSpinner = setPathForLibDirectory('loadingSpinner/loadingSpinner');
var addLoadingMessage = true;
var messageType = 'map';
var spinner = new loadingSpinner(true, 'map');
spinner.addTo($.map);
spinner.show();

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

$.Map.url=json.data.museum.map;

// cache.getFile({
	// url: json.data.museum.map,
	// onsuccess: function(filePath, request) {
		// // wrap filePath (image) in html and assign to webview url
	// }
// });

function hideSpinner(){
	spinner.hide();
}

$.onEnterKioskMode = function() {
	$.navBar.onEnterKioskMode();
};

$.onExitKioskMode = function() {
	$.navBar.onExitKioskMode();
};