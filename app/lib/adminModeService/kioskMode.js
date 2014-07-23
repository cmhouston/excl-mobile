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

function KioskMode() {
	this.kioskMode = false;
}

// Return true if in kiosk mode and false otherwise
KioskMode.prototype.isInKioskMode = function() {
	return this.kioskMode;
};


// Handles updateing kiosk mode status.
// Used in addKioskModeListener()
KioskMode.prototype.updateKioskMode = function(){
	
	// Create confirmation dialog
	var confirm = Ti.UI.createAlertDialog({
	    title: '',
	    buttonNames: ['OK']
	});
	
	// Get top window to access call back functions
	
	// Deactivate kiosk mode if active or vice versa
	if (this.kioskMode === false) {
    	this.kioskMode = true;
    	confirm.title = 'Activated Kiosk Mode';
    	Alloy.Globals.navController.enterKioskMode();
    	
	} else {
		this.kioskMode = false;
	    confirm.title = 'Deactivated Kiosk Mode';
    	Alloy.Globals.navController.exitKioskMode();
	}
	confirm.show();
	setTimeout(function(){confirm.hide();}, 2000);
};

KioskMode.prototype.exitKioskMode = function(){
		this.kioskMode = false;
    	Alloy.Globals.navController.exitKioskMode();
};


/*
// Handles kiosk mode dialog
// Used in addKioskModeListener()
function handleKioskModeDialog(self) {	
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
			updateKioskMode(self);
	    } else if (e.text == "finterns" || e.source.androidView.value == "finterns") { 
			Alloy.Globals.navController.open(Alloy.createController('finterns'));
    	} else {
	    	var errorMsg = Ti.UI.createAlertDialog({
			    title: 'incorrect code',
			    buttonNames: ['OK']
			});
			errorMsg.show();
			setTimeout(function(){errorMsg.hide();}, 5000);
	    }
	});
	dialog.show();
	setTimeout(function(){dialog.hide();}, 9000);
}//*/


/*

// Add kiosk mode listener to passed in element. Will activate on three 
// long clicks if done withing three seconds. 
KioskMode.prototype.addKioskModeListener = function(element) {
	var count = 0;
	var self = this;
	var handleKioskModeEntry = function(e){
		count += 100;
		if (count === 100) {
			setTimeout(function(){count = 0;}, 3000);
		} else if (count === 300) {
			handleKioskModeDialog(self);
		}
	};
	if (OS_IOS) {
		element.addEventListener('longpress', handleKioskModeEntry);
	} else if (OS_ANDROID) {
		element.addEventListener('longclick', handleKioskModeEntry);	
	}
};*/

module.exports = KioskMode;