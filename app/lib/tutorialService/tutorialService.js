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

var TutorialService = function() {
	this.pages = ["homeTutorial", "exhibitLandingTutorial", "componentLandingTutorial", "sectionLandingTutorial", "postLandingTutorial"];
	this.initializePagesToShowTutorial();
};

TutorialService.prototype.getStorageService = function() {
	if (!this.storageService) {
		var StorageService = require(rootPath + "storageService/storageService");
		this.storageService = new StorageService();
	}
	return this.storageService;
};

TutorialService.prototype.setStorageService = function(storageService) {
	this.storageService = storageService;
};

TutorialService.prototype.getNavService = function() {
	if (!this.navService) {
		var NavigationController = require(rootPath + "navigationService/NavigationController");
		this.navService = new NavigationController();
	}
	return this.navService;
};

TutorialService.prototype.setNavService = function(navService) {
	this.navService = navService;
};

TutorialService.prototype.getAlloyService = function() {
	if (!this.alloyService) {
		this.alloyService = require(rootPath + "customCalls/alloyService");
	}
	return this.alloyService;
};

TutorialService.prototype.setAlloyService = function(alloyService) {
	this.alloyService = alloyService;
};

TutorialService.prototype.initializePagesToShowTutorial = function(force) {
	var storage = this.getStorageService();
	if (!storage.getBoolProperty("tutorialInitialized") || force === "force") {
		Ti.API.info("Tutorial is not initialized. Now initializing tutorial");
		this.setAllPagesTo(true);
		storage.setBoolProperty("tutorialInitialized", true);
	}
	this.updateIsTutorialOn();
};

TutorialService.prototype.resetTutorialMode = function() {
	this.setAllPagesTo(true);
	Alloy.Models.app.set("tutorialOn", true);
	Alloy.Models.app.trigger("change:tutorialOn");
	Alloy.Globals.navController.restart();
};

TutorialService.prototype.endTutorialMode = function() {
	this.setAllPagesTo(false);
	Alloy.Models.app.set("tutorialOn", false);
	Alloy.Models.app.trigger("change:tutorialOn");
};

TutorialService.prototype.setAllPagesTo = function(trueOrFalse) {
	var storage = this.getStorageService();
	var pages = this.pages;
	for (var i = 0; i < pages.length; i++) {
		storage.setBoolProperty(pages[i], trueOrFalse);
	}
	this.updateIsTutorialOn();
};

TutorialService.prototype.checkTutorialForPage = function(page) {
	var pageName = this.getPageNameFromWindow(page);
	var storage = this.getStorageService();
	var showTutorial = storage.getBoolProperty(pageName);
	return (showTutorial) ? pageName : false;
};

TutorialService.prototype.markAsSeen = function(pageName) {
	var storage = this.getStorageService();
	storage.setBoolProperty(pageName, false);
	this.updateIsTutorialOn();
};

TutorialService.prototype.updateIsTutorialOn = function() {
	if (this.isAnyPageOn()) {
		this.setTutorialOn();
	} else {
		this.setTutorialOff();
	}
};

TutorialService.prototype.setTutorialOn = function() {
	var storage = this.getStorageService();
	storage.setBoolProperty("tutorialOn", true);
	if (this.getAlloyService().Models.app) {
		this.getAlloyService().Models.app.set("tutorialOn", true);
		this.getAlloyService().Models.app.trigger("change:tutorialOn");
	}
};

TutorialService.prototype.setTutorialOff = function() {
	var storage = this.getStorageService();
	storage.setBoolProperty("tutorialOn", false);
	if (this.getAlloyService().Models.app) {
		this.getAlloyService().Models.app.set("tutorialOn", false);
		this.getAlloyService().Models.app.trigger("change:tutorialOn");
	}
};

TutorialService.prototype.isAnyPageOn = function() {
	var storage = this.getStorageService();
	var anyPageIsOn = false;
	var pages = this.pages;
	for (var i = 0; i < pages.length; i++) {
		if(storage.getBoolProperty(pages[i])) {
			anyPageIsOn = true;
		}
	}
	return anyPageIsOn;
};

TutorialService.prototype.gotIt = function(page) {
	var storage = this.getStorageService();
	storage.setBoolProperty(page, false);
};

TutorialService.prototype.getPageNameFromWindow = function(page) {
	var pageName = page.analyticsPageLevel.replace(/\s/g, '') + "Tutorial";
	return pageName.charAt(0).toLowerCase() + pageName.substr(1);
};

module.exports = TutorialService;