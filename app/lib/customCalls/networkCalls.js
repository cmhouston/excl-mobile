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
			Alloy.Globals.navController.restart();
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
