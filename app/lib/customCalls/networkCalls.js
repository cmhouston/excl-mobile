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

var apiCalls, parseCalls;

function setPathForLibDirectory(apiCallsLib, parseCallsLib) {
	if ( typeof Titanium == 'undefined') {
		// this is required for jasmine-node to run via terminal
		apiCalls = require('../../lib/customCalls/' + apiCallsLib);
		parseCalls = require('../../lib/customCalls/' + parseCallsLib);
	} else {
		apiCalls = require('customCalls/' + apiCallsLib);
		parseCalls = require('customCalls/' + parseCallsLib);
	}
}

function createNetworkErrorDialog(e){
	var dialog = Ti.UI.createAlertDialog({
	    buttonNames: ['Try Again'],
	    message: 'Looks like your network connection is playing hide and seek!',
	    title: 'Poor Connection',
	    persistent: true
	});
	if (OS_ANDROID){
		dialog.cancel = 1;
	}
	dialog.show();
	
	dialog.addEventListener('click', function(e){
		if (e.index == 0){		
			//Alloy.Globals.navController.restart();
			Alloy.Models.app.retrieveMuseumData(true);
		}
		else if (e.index == e.source.cancel){
			createNetworkErrorDialog(e);
		}
	});
}

var networkCalls = {

	network : function(url, onSuccess, onFail) {
		
		if(!onFail){
			onFail = function(e) {
				createNetworkErrorDialog(e);
			};
		}
		
		
		var client = Ti.Network.createHTTPClient({
			onload : function() {
				var json = parseCalls.parse(this.responseText);
				onSuccess(json);
			},
			onerror : onFail
		});

		return client;
	},
};

setPathForLibDirectory('apiCalls', 'parseCalls');
module.exports = networkCalls;
