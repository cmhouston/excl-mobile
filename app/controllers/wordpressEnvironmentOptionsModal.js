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
var networkCalls = setPathForLibDirectory('customCalls/networkCalls');
var toggleUnpublishedPosts;

var onSuccess = function() {
	addUnpublishedPostsFunctionality();
	Alloy.Globals.navController.restart();
	alert("Entered new Wordpress environment");
};

var onFail = function() {
	alert("invalid url");
	Alloy.Globals.setRootWebServiceFromUrls("prod");
	// Reset to default url
};

function setPathForLibDirectory(libFile) {
	if ( typeof Titanium == 'undefined') {
		lib = require("../../lib/" + libFile);
	} else {
		lib = require(libFile);
	}
	return lib;
}

function cancel(e) {
	Alloy.Globals.navController.close();
}

function enterProductionMode(e) {
	Alloy.Globals.setRootWebServiceFromUrls("prod");
	addUnpublishedPostsFunctionality();
	Alloy.Globals.navController.restart();
	alert("Entered Production Wordpress Environment");
}

function enterDevelopmentMode(e) {
	Alloy.Globals.setRootWebServiceFromUrls("dev");
	addUnpublishedPostsFunctionality();
	Alloy.Globals.navController.restart();
	alert("Entered Development Wordpress Environment");
}

function enterQualityAssuranceMode(e) {
	Alloy.Globals.setRootWebServiceFromUrls("qa");
	addUnpublishedPostsFunctionality();
	Alloy.Globals.navController.restart();
	alert("Entered Quality Assurance Wordpress Environment");
}

function enterOtherMode(self) {

	var textfield = Ti.UI.createTextField({
		height : "35dip",
		top : "100dip",
		left : "30dip",
		width : "250dip",
		borderStyle : Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	var dialog = Ti.UI.createAlertDialog({
		title : 'Enter wordpress url',
		androidView : textfield,
		buttonNames : ['OK']
	});

	if (OS_IOS) {
		dialog.style = Ti.UI.iPhone.AlertDialogStyle.PLAIN_TEXT_INPUT;
	}

	dialog.addEventListener('click', function(e) {
		if (e.text || e.source.androidView.value) {
			if (OS_IOS) {
				handleUrl(e.text);
			} else if (OS_ANDROID) {
				handleUrl(e.source.androidView.value);
			}
		} else {
			var errorMsg = Ti.UI.createAlertDialog({
				title : 'no url entered',
				buttonNames : ['OK']
			});
			errorMsg.show();
			setTimeout(function() {
				errorMsg.hide();
			}, 5000);
		}
	});
	dialog.show();
}

function handleUrl(url) {
	Alloy.Globals.setRootWebServiceUrl(url);
	var client = networkCalls.network(url, onSuccess, onFail);
	if (client) {
		client.open("GET", url);
		client.send();
	} else {
		alert("could not connect to host");
		Alloy.Globals.setRootWebServiceFromUrls("prod");
		// Reset to default url
	}
}

function switchPush(e) {
	toggleUnpublishedPosts = !toggleUnpublishedPosts;
}

function addUnpublishedPostsFunctionality() {
	if (toggleUnpublishedPosts) {
		Alloy.Globals.adminModeController.toggleViewUnpublishedPosts();
	}
}

function formatObjects() {
	if (Titanium.Platform.osname == "ipad") {
		$.title.font = {
			fontSize : "30dip",
			fontWeight : "bold"
		};
	}
}

function init() {
	toggleUnpublishedPosts = false;
	$.toggleUnpublishedPostsSwitch.value = Alloy.Globals.adminModeController.viewUnpublishedPostsIsEnabled();
	$.toggleUnpublishedPostsSwitch.addEventListener('change', switchPush);
	$.currentEnvironLabel.text = Alloy.Globals.storageService.getStringProperty("rootWebServiceURL");
	formatObjects();
}

init();

