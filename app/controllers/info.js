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

var url = Alloy.Globals.rootWebServiceUrl;

var json = args[0];

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
Ti.API.info(json.data.museum.info);
$.InfoText.html = json.data.museum.info;

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

