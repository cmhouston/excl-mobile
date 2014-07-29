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
var filterTabIds = [];
var parentObjects = [];
var firstView;

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

var dictOrderedPosts = {};
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
Alloy.Models.app.on("change:customizeLearningSet", detectEventEnabled);
var filterOn = Alloy.Models.app.get("customizeLearningEnabled");

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
	parentObjects = [];

	var objectArgs;
	objectArgs = {
		borderRadius : 0,
		backgroundColor : '#E74C3C',
		width : '100%',
		top : "0",
		height : "50dip",
		layout : 'horizontal',
		id : 'buttonHolderView'
	};
	var buttonHolderView = viewService.createCustomView(objectArgs);
	$.scrollView.add(buttonHolderView);

	var each_button_width = Math.floor(100 / numberOfButtons);
	each_button_width += '%';

	for (var i = 0; i < numberOfButtons; i++) {
		objectArgs = {
			title : filterTabIds[i],
			width : each_button_width,
			height : "50dip",
			borderColor : '#E74C3C',
			borderRadius : "10dip",
			backgroundColor : '#1ABC9C',
			color : '#ECF0F1',
			id : "button" + i,
			viewAssociatedId : filterTabIds[i]
		};
		var button = buttonService.createCustomButton(objectArgs);
		Ti.API.info(JSON.stringify(button));
		if (button.title == "0") {
			button.title = titleForAllInclusiveFilterSection;
		}
		Ti.API.info(JSON.stringify(button));

		objectArgs = {
			borderRadius : "30dip",
			backgroundColor : colorArray[colorArrayCounter],
			width : '100%',
			height : '0',
			visible : false,
			layout : "vertical",
			id : filterTabIds[i]
		};
		var view = viewService.createCustomView(objectArgs);
		Ti.API.info(JSON.stringify(view));
		
		keepFirstViewOpen(view, button, i);
		parentObjects.push(view);
		colorArrayCounter++;
		$.scrollView.add(view);

		button.addEventListener('click', function(e) {
			Ti.API.info("Visible view: " + JSON.stringify(e.source.viewAssociatedId));
			changeButtonColor(e.source);
			showRespectiveView(e.source);
		});
		buttonHolderView.add(button);
	}
	//hideButtonViewIfOnlyOneButton(buttonHolderView, numberOfButtons);

	for (var i = 0; i < parentObjects.length; i++) {
		Ti.API.info("Added View ID (" + i + ") " + JSON.stringify(parentObjects[i].id));
	}
}

function showRespectiveView(buttonSource) {
	for (var child in $.scrollView.children) {
		if ($.scrollView.children[child].id) {
			if (buttonSource.viewAssociatedId == $.scrollView.children[child].id) {
				if (lastSelectedView) {
					$.scrollView.children[lastSelectedView].visible = false;
					$.scrollView.children[lastSelectedView].height = "0";
				}
				$.scrollView.children[child].visible = true;
				$.scrollView.children[child].height = Ti.UI.SIZE;
				lastSelectedView = child;
			}
		}
	}
}

function keepFirstViewOpen(view, button, i) {
	if (i == 0) {
		openFirstView(view);
		button.backgroundColor = '#ECF0F1';
		button.color = '#1ABC9C';
		lastSelectedButton = button;
		firstView = view;
		lastSelectedView = 1;
	}
}

function openFirstView(view) {
	view.visible = true;
	view.height = Ti.UI.SIZE;
}

function changeButtonColor(buttonId) {
	if (lastSelectedButton) {
		lastSelectedButton.backgroundColor = '#1ABC9C';
		lastSelectedButton.color = '#ECF0F1';
	}
	buttonId.backgroundColor = '#ECF0F1';
	buttonId.color = '#1ABC9C';
	lastSelectedButton = buttonId;
}

function hideButtonViewIfOnlyOneButton(buttonHolderView, numberOfButtons) {
	if (numberOfButtons == 1) {
		buttonHolderView.height = "0";
		buttonHolderView.visible = false;
	}
}

/////////////////////////////////////////// End TabTest Logic

function detectEventEnabled() {
	filterOn = Alloy.Models.app.get("customizeLearningEnabled");
	Ti.API.info("Filter On => ", filterOn);
	retrieveComponentData();
	changeTitleOfThePage(selectedSection, sectionColor);
	hideMenuBtnIfKioskMode();
}

function retrieveComponentData() {
	filter.setAllInclusiveFilter(titleForAllInclusiveFilterSection);
	resetPage();
	organizePosts(allPosts);
}

function resetPage() {
	dictOrderedPosts = {};
	$.scrollView.removeAllChildren();
	filterTabIds = ["0"];
}

function organizePosts(allPosts) {
	updateFilterIdArray();
	
	if (filterOn) {
		selectedFilters = filter.formatActiveFiltersIntoArray(Alloy.Collections.filter);
		Ti.API.info("Filter list: " + JSON.stringify(selectedFilters));
		for (var i = 0; i < allPosts.length; i++) {
			filter.sortFilteredContentIntoDict(selectedFilters, dictOrderedPosts, allPosts[i]);
		}
	}
	$.scrollView.removeAllChildren;
	insertXNumberOfButtons(filterTabIds.length);
	openFirstView(firstView);
	
	Ti.API.info("Dict of Posts 1 (only if filter on): " + JSON.stringify(dictOrderedPosts));

	for (var i = 0; i < allPosts.length; i++) {
		filter.compileDictOfSections(allPosts[i], dictOrderedPosts, selectedSection);
	}
	
	Ti.API.info("Dict of Posts 2: " + JSON.stringify(dictOrderedPosts));
	Ti.API.info("Parents 1: " + JSON.stringify(parentObjects));
	
	filter.sortPostsIntoSections(dictOrderedPosts, parentObjects);
	$.scrollView.height = "100%";
	Ti.API.info("Finished Sorting");
}

function updateFilterIdArray() {
	var filters = filter.formatActiveFiltersIntoArray(Alloy.Collections.filter);
	for (var i = 0; i < filters.length; i++) {
		filterTabIds.push(filters[i].toString());
	}
	Ti.API.info("All tab ids: " + filterTabIds);
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

detectEventEnabled();
