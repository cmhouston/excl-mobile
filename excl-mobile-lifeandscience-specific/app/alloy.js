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

var AnalyticsController = require('analyticService/analyticService');
Alloy.Globals.analyticsController = new AnalyticsController();

var AdminModeController = require('adminModeService/AdminModeController');
Alloy.Globals.adminModeController = new AdminModeController();

var StorageService = require('storageService/storageService');
Alloy.Globals.storageService = new StorageService();

Alloy.Globals.isInDefaultWordpressEnviroment = function(){
	return this.rootWebServiceUrl == Alloy.CFG.excl.wordpressEnvironments["prod"];
};

Alloy.Globals.setRootWebServiceFromUrls = function(key){
	if( Alloy.CFG.excl.wordpressEnvironments[key] ){
		Alloy.Globals.setRootWebServiceUrl(Alloy.CFG.excl.wordpressEnvironments[key]);
	}
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
Alloy.Globals.rotate270 = Ti.UI.create2DMatrix().rotate(270);
Alloy.Globals.rotate60 = Ti.UI.create2DMatrix().rotate(60);
Alloy.Globals.rotate130 = Ti.UI.create2DMatrix().rotate(130);
Alloy.Globals.rotate145 = Ti.UI.create2DMatrix().rotate(145);
Alloy.Globals.rotate245 = Ti.UI.create2DMatrix().rotate(245);
Alloy.Globals.rotate220 = Ti.UI.create2DMatrix().rotate(210);

// do not remove: initialization of global backbone models
Alloy.Models.app = Alloy.Models.instance('app');

Alloy.Models.app.on('change:currentLanguage', function() {
	Alloy.Models.app.restart( function() {
		var message = Alloy.Globals.museumJSON.data.museum.internationalization_message;
		if (message != '') {
			var dialogService = Alloy.Globals.setPathForLibDirectory('customCalls/dialogService');
			dialogService = new dialogService();
			alertDialog = dialogService.createAlertDialog(message);
			alertDialog.buttonNames = ["Ok"];
			alertDialog.show();
		}
	});
});

Alloy.Collections.filter = Alloy.Collections.instance('filter');
Alloy.Models.app.start();

