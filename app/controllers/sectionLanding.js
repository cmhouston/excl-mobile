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

var allPosts = eval(args[1]);
var selectedSection = args[2];
var sectionColor = args[3];
var sectionScreenName = args[4];
var filterTabIds = [$.scrollView, "thing1", "thing2", "thing3", "thing4", "thing5"];
var parentObjectIds = [];

var dataRetriever = setPathForLibDirectory('dataRetriever/dataRetriever');
var loadingSpinner = setPathForLibDirectory('loadingSpinner/loadingSpinner');
var spinner = new loadingSpinner();
var filterService = setPathForLibDirectory('filterService/filterService');
var filter = new filterService();
var viewService = setPathForLibDirectory('customCalls/viewService');
viewService = new viewService();
var buttonService = setPathForLibDirectory('customCalls/buttonService');
buttonService = new buttonService();

// this line is use
filter.setSectionScreenName(sectionScreenName);

var dictOrderedPostsBySection = {};
var dictOrderedPostsByFilter = {};
var selectedFilters;

var titleForAllInclusiveFilterSection = "For Everyone in Your Group";

//------------------
var component = args[0];
var componentID = component.get('id');
var url = Alloy.Globals.rootWebServiceUrl + "/component/" + componentID;

/**
 * Analytics Specific Information
 */
var analyticsPageTitle = "Section Landing";
var analyticsPageLevel = "Section Landing";

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
exports.setAnalyticsPageTitle = setAnalyticsPageTitle;
exports.getAnalyticsPageTitle = getAnalyticsPageTitle;
exports.setAnalyticsPageLevel = setAnalyticsPageLevel;
exports.getAnalyticsPageLevel = getAnalyticsPageLevel;
//--------------------------------------------------

$.onEnterKioskMode = function() {
	$.navBar.onEnterKioskMode();
};

$.onExitKioskMode = function() {
	$.navBar.onExitKioskMode();
};

Alloy.Models.app.on("change:customizeLearningEnabled", detectEventEnabled);
Alloy.Models.app.on("change:customizeLearningSet", detectEventSet);
var filterOn = Alloy.Models.app.get("customizeLearningEnabled");
var filterSet = Alloy.Models.app.get("customizeLearningSet");

function setPathForLibDirectory(libFile) {
	if ( typeof Titanium == 'undefined') {
		lib = require("../../lib/" + libFile);
	} else {
		lib = require(libFile);
	}
	return lib;
};

///////////////////////////////////////////Begin TabTest Logic

var
lastSelectedButton;
var lastSelectedView;
var colorArray = ['#ECD078', '#D95B43', '#C02942', '#542437', '#53777A'];
var colorArrayCounter = 0;

function insertXNumberOfButtons(numberOfButtons) {
	var objectArgs;
	objectArgs = {
		borderRadius : 0,
		backgroundColor : '#E74C3C',
		width : '100%',
		height : 50,
		top : '40%',
		layout : 'horizontal',
		id : 'buttonHolderView'
	};
	var buttonHolderView = viewService.createCustomView(objectArgs);

	var each_button_width = Math.floor(100 / numberOfButtons);
	each_button_width += '%';

	for (var i = 0; i < numberOfButtons; i++) {
		objectArgs = {
			title : "Number " + i,
			width : each_button_width,
			height : 50,
			borderColor : '#E74C3C',
			borderRadius : 10,
			backgroundColor : '#1ABC9C',
			color : '#ECF0F1',
			id : "button" + i,
			viewAssociatedId : filterTabIds[i + 1]
		};
		var button = buttonService.createCustomButton(objectArgs);

		objectArgs = {
			borderRadius : 30,
			backgroundColor : colorArray[colorArrayCounter],
			width : '100%',
			height : '100%',
			top : '50%',
			visible : false,
			id : filterTabIds[i + 1]
		};
		var view = viewService.createCustomView(objectArgs);
		colorArrayCounter++;
		$.scrollView.add(view);

		alert("STOP");

		button.addEventListener('click', function(e) {
			Ti.API.info(JSON.stringify(e.source));
			changeButtonColor(e.source);
			showRespectiveView(e.source);
		});
		buttonHolderView.add(button);
	}

	$.scrollView.add(buttonHolderView);

	alert("STOP AGAIN");
}

function showRespectiveView(buttonSource) {
	for (var child in $.scrollView.children) {
		if ($.scrollView.children[child].id) {
			if (buttonSource.viewAssociatedId == $.scrollView.children[child].id) {
				if (lastSelectedView) {
					$.scrollView.children[lastSelectedView].visible = false;
				}
				$.scrollView.children[child].visible = true;
				lastSelectedView = child;
			}
		}
	}
}

function changeButtonColor(buttonId) {
	if (lastSelectedButton) {
		// if lastSelectedButton exists then this will be executed
		lastSelectedButton.backgroundColor = '#1ABC9C';
		lastSelectedButton.color = '#ECF0F1';
	}
	buttonId.backgroundColor = '#ECF0F1';
	buttonId.color = '#1ABC9C';
	lastSelectedButton = buttonId;
}

/////////////////////////////////////////// End TabTest Logic

function detectEventSet() {
	filterSet = Alloy.Models.app.get("customizeLearningSet");
	detectEventEnabled();
}

function detectEventEnabled() {
	filterOn = Alloy.Models.app.get("customizeLearningEnabled");
	//Ti.API.info("Filter Status 2: " + JSON.stringify(Alloy.Collections.filter));
	//Ti.API.info("Filter Detected (Comp): set: " + filterSet + ", on: " + filterOn);
	retrieveComponentData();
	changeTitleOfThePage(selectedSection, sectionColor);
	hideMenuBtnIfKioskMode();
}

function retrieveComponentData() {
	filter.setAllInclusiveFilter(titleForAllInclusiveFilterSection);
	clearOrderedPostDicts();
	//addSpinner();
	checkIfFilterOn(allPosts);
	//removeSpinner();
}

function clearOrderedPostDicts() {
	dictOrderedPostsBySection = {};
	dictOrderedPostsByFilter = {};
	$.scrollView.removeAllChildren();
}

function addSpinner() {
	//spinner.addTo(currentTabGroup);
	spinner.addTo($.scrollView);
	spinner.show();
}

function removeSpinner() {
	spinner.hide();
}

function checkIfFilterOn(allPosts) {
	Ti.API.info("Organizing content by section");
	organizeBySection(allPosts);
	if (filterOn) {
		//Ti.API.info("Adding tabs");
		organizeByFilter(allPosts);
	}
}

function organizeBySection(allPosts) {
	dictOrderedPostsBySection = {};
	for (var i = 0; i < allPosts.length; i++) {
		filter.compileDictOfSections(allPosts[i], dictOrderedPostsBySection, selectedSection);
	}
	$.scrollView.removeAllChildren();

	parentObjectIds = [$.scrollView];
	// for (var child in $.scrollView.children) {
	// parentObjectIds.push($.scrollView.children[child].id);
	// }

	filter.sortPostsIntoSections(dictOrderedPostsBySection, parentObjectIds);
	Ti.API.info("Finished Organizing by Section");
}

function organizeByFilter(allPosts) {
	dictOrderedPostsByFilter = {};
	selectedFilters = filter.formatActiveFiltersIntoArray(JSON.stringify(Alloy.Collections.filter));
	Ti.API.info("Filter: " + JSON.stringify(selectedFilters));
	for (var i = 0; i < allPosts.length; i++) {
		filter.sortFilteredContentIntoDict(selectedFilters, dictOrderedPostsByFilter, allPosts[i]);
	}
	// tabs will be using filter names, not user friendly ones// dictOrderedPostsByFilter = filter.replaceDictKeysWithFilterHeadings(dictOrderedPostsByFilter);

	insertXNumberOfButtons(filterTabIds.length);

	Ti.API.info("101");

	parentObjectIds = [$.scrollView];
	for (var child in $.scrollView.children) {
		parentObjectIds.push($.scrollView.children[child].id);
	}

	Ti.API.info("102: All Parent IDs: " + JSON.stringify(parentObjectIds));

	filter.sortPostsIntoSections(dictOrderedPostsByFilter, parentObjectIds);

	$.scrollView.height = Ti.UI.SIZE;
	Ti.API.info("Finished Filtering");
}

function changeTitleOfThePage(name, color) {
	$.navBar.setPageTitle(name);
	$.navBar.setBackgroundColor(color);
}

function hideMenuBtnIfKioskMode() {
	if (Alloy.Globals.adminModeController.isInKioskMode()) {
		$.navBar.hideMenuBtn();
	}
}

function goToPostLandingPage(e) {
	var post = fetchPostById(e.source.itemId);
	var analyticsTitle = getAnalyticsPageTitle() + '/' + post.name;
	Ti.API.info("---000---\r\n" + analyticsTitle);
	var analyticsLevel = "Post Landing";
	//currentTabGroup.remove();
	var controller = Alloy.createController('postLanding', post);
	controller.setAnalyticsPageTitle(analyticsTitle);
	controller.setAnalyticsPageLevel(analyticsLevel);
	Alloy.Globals.navController.open(controller);
}

detectEventSet();
