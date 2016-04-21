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

var rootPath = (typeof Titanium == 'undefined')? '../../lib/customCalls/' : 'customCalls/';
var apiCalls;
setPathForLibDirectory(rootPath);

function setPathForLibDirectory(rootPath) {
	apiCalls = require(rootPath + 'apiCalls');
}

function AnalyticsController() {
	this.pageLevelCustomDimensionIndex = 4; // Index from Google Analytics website // TODO: get from Wordpress dynamically
	this.kioskModeCustomDimensionIndex = 5; // Index from Google Analytics website
}

AnalyticsController.prototype.getTracker = function() {
	if (!this.validateTrackerID(this.trackerID)) {
		apiCalls.info("Invalid or no Google Analytics Tracker ID found. Turning off analytics.");
		return false;
	}
	if (this.tracker == null && this.trackerID != null) {
		this.GA = require('analytics.google');
		this.tracker = this.GA.getTracker(this.trackerID);
		//this.GA.debug = true; // Outputs more explicit messages to the console
		//this.GA.trackUncaughtExceptions = true;
	}
	return this.tracker;
};

AnalyticsController.prototype.validateTrackerID = function(trackerID) {
	apiCalls.info("Tracker ID: "+trackerID);
	return /(UA|YT|MO)-\d+-\d+/i.test(trackerID);
};

AnalyticsController.prototype.setTrackerID = function(trackerID) {
	this.trackerID = trackerID;
};

// TODO if screenName, pageLevel are blank, don't track anything
AnalyticsController.prototype.trackScreen = function(screenName, pageLevel, kioskMode){
	return false;
	var tracker = this.getTracker();
	if (!tracker) {return false;}

	if(Alloy.Globals.isInDefaultWordpressEnviroment()){
		
		var customDimensionObject = {};
		customDimensionObject[this.pageLevelCustomDimensionIndex] = pageLevel;
		
		if(kioskMode)
			customDimensionObject[this.kioskModeCustomDimensionIndex] = "on";
		else
			customDimensionObject[this.kioskModeCustomDimensionIndex] = "off";
	
		apiCalls.info("Now tracking screen " + screenName);
		var properties = {
			path: screenName,
			customDimension: customDimensionObject,
			toString: function(){	return this.path;}		// Overwrites the Object toString which returns [object Object]. This allows screen tracking in GA module 1.0
		};
		//apiCalls.info(JSON.stringify(properties));
		tracker.trackScreen(screenName);
	}
};

AnalyticsController.prototype.trackEvent = function(category, action, label, value) {
	return false;
	var tracker = this.getTracker();
	if (!tracker) {return false;}
	
	if(Alloy.Globals.isInDefaultWordpressEnviroment()){
		Ti.API.info("Now tracking event with category: " + category + ", action: " + action + ", label: " + label + ", value: " + value);
		tracker.trackEvent({
			category: category,
			action: action,
			label: label,
			value: value
		});
	}
};

module.exports = AnalyticsController;

/*tracker.trackEvent({
	category: "category",
	action: "click",
	label: "label",
	value: 1
});
tracker.trackSocial({
	network: "facebook",
	action: "action",
	target: "target"
});
tracker.trackTiming({
	category: "",
	time: 10,
	name: "",
	label: ""
});*/
