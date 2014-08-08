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

//=====================================================================
// The ExCL NavigationController is a heavily adapted version of Vui Nguyen's
// project, NavController (https://github.com/vuinguyen/NavController), which
// was itself a 2013 update on the Ti-Navigation-Controller, originally written
// by Kevin Whinnery, with multiple other contributors. 
//=====================================================================

var rootPath = (typeof Titanium == 'undefined')? '../../lib/' : '';

function NavigationController() {
	this.windowStack = [];
	this.Page = null;
	this.lockedPage = null;
	this.alloy = require(rootPath + "customCalls/alloyService");
	this.analyticsController = this.alloy.Globals.analyticsController;
	this.menu = require(rootPath + "navigationService/flyoutService");
	var TutorialController = require(rootPath + "tutorialService/tutorialService");
	this.tutorialController = new TutorialController();
	var pageLevelList = [];
}

NavigationController.prototype.restart = function(callback){
	Alloy.Globals.adminModeController.disableKioskMode();
	this.home();
	this.windowStack[0].reload(callback);
};

NavigationController.prototype.enterKioskMode = function(){
		var window = this.windowStack[this.windowStack.length - 1];
	    this.setLocked();
 		this.menu.closeMenu();
		window.onEnterKioskMode(window);
};

NavigationController.prototype.exitKioskMode = function(){
		var window = this.windowStack[this.windowStack.length - 1];
		this.reset();
		window.onExitKioskMode(window);
};

NavigationController.prototype.open = function(controller) {
	if (this.windowStack.length > 0){
		if (this.checkPageLevel(controller) == false){
			return false;
		}
	}
	
	var windowToOpen = this.getWindowFromController(controller);
	try {	
		var win = this.openWindow(windowToOpen);
		return win;
	} catch(e) {
		Ti.API.error("Failed to open window: " + e);
		return false;
	}
};

NavigationController.prototype.checkPageLevel = function(controllerToBeOpened) {
	pageLevelToBeOpened = _.isFunction(controllerToBeOpened.getAnalyticsPageLevel) ? controllerToBeOpened.getAnalyticsPageLevel() : "[Unnamed Level]";
	if (this.windowStack[this.windowStack.length-1].analyticsPageLevel == pageLevelToBeOpened){
		return false;
	}

	return true;	
};

NavigationController.prototype.getWindowFromController = function(controller) {
	var		windowToOpen = controller.getView();
			windowToOpen = this.attachControllerInfoToView(controller, windowToOpen);
	return	windowToOpen;
};

NavigationController.prototype.attachControllerInfoToView = function(controller, windowToOpen) {
	windowToOpen.onEnterKioskMode	= _.isFunction(controller.onEnterKioskMode) ? controller.onEnterKioskMode : function(windowToOpen){};
	windowToOpen.onExitKioskMode	= _.isFunction(controller.onExitKioskMode) ? controller.onExitKioskMode : function(windowToOpen){};
	windowToOpen.analyticsPageTitle	= _.isFunction(controller.getAnalyticsPageTitle) ? controller.getAnalyticsPageTitle() : "[Unnamed Screen]";
	windowToOpen.analyticsPageLevel	= _.isFunction(controller.getAnalyticsPageLevel) ? controller.getAnalyticsPageLevel() : "[Unnamed Level]";
	windowToOpen.reload 			= _.isFunction(controller.reload) ? controller.reload : function(){};
	return windowToOpen;
};

NavigationController.prototype.openWindow = function(windowToOpen) {
	this.prepWindowsWithFlyout(windowToOpen);
	this.addCloseEventListenersToWindow(windowToOpen);
	this.analyticsTrackWindowScreen(windowToOpen);
	if (this.windowStack.length === 0) {
		this.openHomeScreen(windowToOpen);
	} else {
		this.openNewScreen(windowToOpen);
	}
	this.openTutorial(windowToOpen);
	this.windowStack.push(windowToOpen);
	return windowToOpen;
};


NavigationController.prototype.prepWindowsWithFlyout = function(windowToOpen) {
	windowToOpen.add(this.menu.getNewMenu());
	//removeMenuFromWindow(this.windowStack, this.menu);
};

NavigationController.prototype.openHomeScreen = function(windowToOpen) {
	this.Page = windowToOpen;
	this.lockedPage = this.Page;
	windowToOpen.analyticsPageTitle = "Home";
	windowToOpen.analyticsPageLevel = "Home";

	if (OS_ANDROID) {
		//hack - setting this property ensures the window is "heavyweight" (associated with an Android activity)
		windowToOpen.navBarHidden = windowToOpen.navBarHidden || false;
		windowToOpen.exitOnClose = true;
		windowToOpen.open({animated : false});
	} else {
		// changed this from Ti.UI.iPhone.createNavigationGroup because it has been deprecated
		// since Ti 3.2.0
		if (!this.navGroup) {
			this.navGroup = Ti.UI.iOS.createNavigationWindow({
				window : windowToOpen
			});
		}
		this.navGroup.open({animated : false});
	}
};

NavigationController.prototype.openNewScreen = function(windowToOpen) {
	if (OS_ANDROID) {
		//hack - setting this property ensures the window is "heavyweight" (associated with an Android activity)
		windowToOpen.navBarHidden = windowToOpen.navBarHidden || false;
		windowToOpen.open({animated : false});
	} else if (OS_IOS) {
		this.navGroup.openWindow(windowToOpen, {animated : false});
	}
};

NavigationController.prototype.addCloseEventListenersToWindow = function(windowToOpen){
	var self = this; // for use in callbacks
	
	// Capture Android back button
	if (OS_ANDROID) {
		windowToOpen.addEventListener("android:back", function(e){
			if(self.windowStack[self.windowStack.length-1] != self.lockedPage) {
				self.close(1);
			}
			
			// Close the app if you are on the home page and kiosk mode is disabled
			if(self.windowStack.length == 1 && !Alloy.Globals.adminModeController.isInKioskMode()){
				Titanium.Android.currentActivity.finish();
			}
		});
	}

	var lastPushed = windowToOpen;
	windowToOpen.addEventListener('close', function() {
		Ti.API.info("In the close event listener for window: ", windowToOpen.toString());
		
		if (self.windowStack.length > 0) // don't pop the last Window, which is the base one
		{
			Ti.API.info("close event listener: window stack greater than 0");
			var popped = self.windowStack.pop();

			// close dependent window ?
			if (this.toClose) {
			 	// close "parent" window, do not use animation (it looks weird with animation)
			 	(self.navGroup) ? self.navGroup.closeWindow(this.toClose, {animated : false}) : this.toClose.close({animated:false});
			 	// (self.navGroup) ? self.navGroup.closeWindow(this.toClose, {animated : true}) : this.toClose.close({animated:true});
			}
			
			// open dependent window ?
			if (this.toOpen) {
			 	self.open(this.toOpen, {animated : false});
			}
		} // end if windowStack.length > 1, and end of my hack
		this.waitForWindowsToClose = false;
	}); // end eventListener 'close'
	
	windowToOpen.addEventListener('set.to.close', function(dict) {
		this.toClose = dict.win;
	});
	
	windowToOpen.addEventListener('set.to.open', function(dict) {
		this.toOpen = dict.win;
	});
};

// Note: without a parameter, close automatically closes 1 window
NavigationController.prototype.close = function(numWindows) {
	this.menu.closeMenuWithoutAnimation();
	if (this.windowStack.length > 1 && this.windowStack[this.windowStack.length - 1] != this.lockedPage) {
		this.waitForWindowsToClose = true;
		removeMenuFromWindow(this.windowStack, this.menu);
		if (numWindows > 1) {
			// setup chain reaction by setting up the flags on all the windows
			var i = this.windowStack.length - 1;
			for (var j = 1; j < numWindows; j++) {
				// set dependent window
				this.windowStack[i].fireEvent('set.to.close', {win: this.windowStack[i - 1]});
				i--;
	       	}
	        // start chain reaction, close first window
			(this.navGroup) ? this.navGroup.closeWindow(this.windowStack[this.windowStack.length - 1]) : this.windowStack[this.windowStack.length - 1].close({animated : false});
		} else {
			(this.navGroup) ? this.navGroup.closeWindow(this.windowStack[this.windowStack.length - 1]) : this.windowStack[this.windowStack.length - 1].close();
		}
		addMenuToNextWindow(this.windowStack, this.menu);
		this.analyticsTrackWindowScreen(this.windowStack[this.windowStack.length - 2]);
	} else {
		this.analyticsTrackWindowScreen(this.windowStack[0]);
	}
};

// go back to the initial window of the NavigationController
NavigationController.prototype.home = function() {
	removeMenuFromWindow(this.windowStack, this.menu);
	this.closeMenuWithoutAnimation();
	if (this.windowStack.length > 1 && this.windowStack[this.windowStack.length - 1] != this.lockedPage) {
		// setup chain reaction by setting up the flags on all the windows 	
   		for (var i = this.windowStack.length - 1; this.windowStack[i-1] != this.lockedPage; i--) {
			// set dependent window
			this.windowStack[i].fireEvent('set.to.close', {win: this.windowStack[i - 1]});
       	}
        // start chain reaction, close first window
		(this.navGroup) ? this.navGroup.closeWindow(this.windowStack[this.windowStack.length - 1], {animated : false}) : this.windowStack[this.windowStack.length - 1].close({animated : false});
		this.analyticsTrackWindowScreen(this.windowStack[0]);
	}
	// addMenuToHomeWindow(this.windowStack, this.menu);
	//addMenuToNextWindow(this.windowStack, this.menu);
};

// Lock page to current top of stack
NavigationController.prototype.setLocked = function(){
	this.lockedPage = this.windowStack[this.windowStack.length - 1];
};

// Reset  page to original 
NavigationController.prototype.reset = function(){
	this.lockedPage = this.Page;
};

NavigationController.prototype.toggleMenu = function(){
	this.menu.toggleMenu();
};

NavigationController.prototype.closeMenuWithoutAnimation = function(){
	this.menu.closeMenuWithoutAnimation();
};

NavigationController.prototype.closeMenu = function() {
	this.menu.closeMenu();
};

NavigationController.prototype.analyticsTrackWindowScreen = function(window) {
	Ti.API.debug("Tracking screen " + window.analyticsPageTitle + " as a " + window.analyticsPageLevel + " level");
	Alloy.Globals.analyticsController.trackScreen(window.analyticsPageTitle, window.analyticsPageLevel, Alloy.Globals.adminModeController.isInKioskMode());
	var kioskModeString = (Alloy.Globals.adminModeController.isInKioskMode()) ? "KioskModeOn" : "KioskModeOff";
	Alloy.Globals.analyticsController.trackEvent(kioskModeString, window.analyticsPageLevel, window.analyticsPageTitle, 1);
};

NavigationController.prototype.openTutorial = function(windowToOpen) {
	var controllerName = this.tutorialController.checkTutorialForPage(windowToOpen);
	if (controllerName !== false) {
		windowToOpen.add(Alloy.createController(controllerName).getView());
		this.tutorialController.markAsSeen(controllerName);
	}
};

function addMenuToHomeWindow(windowStack, menu){
	if(windowStack.length>0){
		windowStack[0].add(menu.getNewMenu());
	}
}

function addMenuToNextWindow(windowStack, menu){
	if(windowStack.length>1){
		windowStack[windowStack.length-2].add(menu.getNewMenu());
	}
}

function removeMenuFromWindow(windowStack, menu){
	Ti.API.info("About to check if window stack is greater than 0 to remove the menu", windowStack);
	if(windowStack.length>0){
		Ti.API.info("About to remove menu", windowStack);
		windowStack[windowStack.length-1].remove(menu.getMenu());
	}
}

module.exports = NavigationController;

