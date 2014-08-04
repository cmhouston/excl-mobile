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

var rootPath = (typeof Titanium == 'undefined')? '../../lib/' : '';
var viewUnpublishedPosts = false;

function ModeController() {
	var kiosk = require(rootPath +'adminModeService/kioskMode');
	this.kioskMode = new kiosk();
};

ModeController.prototype.isInKioskMode = function(){
	return this.kioskMode.isInKioskMode();
};

ModeController.prototype.disableKioskMode = function(){
	if(this.isInKioskMode()){
		this.kioskMode.updateKioskMode();
	}
};

ModeController.prototype.viewUnpublishedPostsIsEnabled = function(){
	return viewUnpublishedPosts;
};

ModeController.prototype.toggleViewUnpublishedPosts = function(){
	viewUnpublishedPosts = !viewUnpublishedPosts;
};

ModeController.prototype.addAdminModeListener = function(element) {
	var count = 0;
	var self = this;
	var handleAdminModeEntry = function(e){
		// Titanium.Media.vibrate([0,200]);
		var colorBackUp = element.backgroundColor;
		element.backgroundColor = 'white';
		setTimeout(function(){element.backgroundColor = colorBackUp;}, 25);
		count += 100;
		if (count === 100) {
			setTimeout(function(){count = 0;}, 3000);
		} else if (count === 300) {
			handleAdminModeDialog(self);
		}
	};
	if (OS_IOS) {
		element.addEventListener('longpress', handleAdminModeEntry);
	} else if (OS_ANDROID) {
		element.addEventListener('longclick', handleAdminModeEntry);	
	}
};

function handleAdminModeDialog(self) {
	var textfield = Ti.UI.createTextField({
		passwordMask:true,
	    height:"35dip",
	    top:"100dip",
	    left:"30dip",
	    width:"250dip",
	    borderStyle:Titanium.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	
	var dialog = Ti.UI.createAlertDialog({
	    title: 'Enter admin code',
	    androidView: textfield,
	    buttonNames: ['OK']
	});
	
	if (OS_IOS) {
		dialog.style = Ti.UI.iPhone.AlertDialogStyle.SECURE_TEXT_INPUT;
	}
	
	dialog.addEventListener('click', function(e) {
	    if (e.text == "friend" || e.source.androidView.value == "friend") {
			self.kioskMode.updateKioskMode();
	    } 
    	else if (e.text == "wordpress" || e.source.androidView.value == "wordpress") {
    		var options = Alloy.createController("wordpressEnvironmentOptionsModal");
    		self.kioskMode.exitKioskMode();
    		Alloy.Globals.navController.closeMenu();
    		Alloy.Globals.navController.open(options);
    	}
    	else if (e.text == "bookmark" || e.source.androidView.value == "bookmark") {
    		var egg = Alloy.createController("bookmark");
    		self.kioskMode.exitKioskMode();
    		Alloy.Globals.navController.closeMenu();
    		Alloy.Globals.navController.open(egg);
    	}
    	else {
	    	var errorMsg = Ti.UI.createAlertDialog({
			    title: 'incorrect code',
			    buttonNames: ['OK']
			});
			errorMsg.show();
			setTimeout(function(){errorMsg.hide();}, 5000);
	    }
	});
	dialog.show();
	// setTimeout(function(){dialog.hide();}, 9000);
}

module.exports = ModeController;
