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

var component = args[0];
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
var labelService = setPathForLibDirectory('customCalls/labelService');
labelService = new labelService();

filter.setSectionScreenName(sectionScreenName);

var dictOrderedPosts = {};
var selectedFilters;
var allInclusiveTabTitle = "All";
var lastSelectedButton;
var lastSelectedView;
var buttonLimit = 3;
var buttonMaxWidth = '95dip';
var componentID = component.get('id');
var url = Alloy.Globals.rootWebServiceUrl + "/component/" + componentID;

Alloy.Models.app.on("change:customizeLearningEnabled", detectEventEnabled);
Alloy.Models.app.on("change:customizeLearningSet", detectEventEnabled);
var filterOn = Alloy.Models.app.get("customizeLearningEnabled");

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

$.onEnterKioskMode = function() {
	$.navBar.onEnterKioskMode();
};

$.onExitKioskMode = function() {
	$.navBar.onExitKioskMode();
};

function setPathForLibDirectory(libFile) {
	if ( typeof Titanium == 'undefined') {
		lib = require("../../lib/" + libFile);
	} else {
		lib = require(libFile);
	}
	return lib;
};

function detectEventEnabled() {
	filterOn = Alloy.Models.app.get("customizeLearningEnabled");
	setUpPage();
	changeTitleOfThePage(selectedSection, sectionColor);
	hideMenuBtnIfKioskMode();
}

function setUpPage() {
	filter.setAllInclusiveTabTitle(allInclusiveTabTitle);
	resetPage();
	organizePosts(allPosts);
}

function resetPage() {
	dictOrderedPosts = {};
	$.scrollView.removeAllChildren();
	filterTabIds = ["0"];
	parentObjects = [];
}

function organizePosts(allPosts) {
	if (filterOn) {
		updateFilterIdArray();
		selectedFilters = filter.formatActiveFiltersIntoArray(Alloy.Collections.filter);
		Ti.API.info("Filter list: " + JSON.stringify(selectedFilters));
		dictOrderedPosts = createEmptyFilterKeysInOrderedPostsDict(dictOrderedPosts, selectedFilters);
		for (var i = 0; i < allPosts.length; i++) {
			filter.sortFilteredContentIntoDict(selectedFilters, dictOrderedPosts, allPosts[i]);
		}
		if (JSON.stringify(dictOrderedPosts) == "{}") {
			showDefaultError();
		}
		if (!dictOrderedPosts["0"]) {
			dictOrderedPosts["0"] = [];
		}
	} else {
		dictOrderedPosts["0"] = allPosts;
	}
	if (Alloy.Globals.adminModeController.isInKioskMode()) {
		Ti.API.info("Removing posts that are excluded for kiosk mode");
		dictOrderedPosts = removePostsThatAreHiddenInKioskMode(dictOrderedPosts);
	}
	insertXNumberOfButtons(filterTabIds.length);
	openFirstView(firstView);

	Ti.API.info("Parents: " + JSON.stringify(filterTabIds));

	filter.sortPostsIntoTabs(dictOrderedPosts, parentObjects);
	$.scrollView.height = Ti.UI.SIZE;
	Ti.API.info("Finished Sorting");
}

function updateFilterIdArray() {
	var filters = filter.formatActiveFiltersIntoArray(Alloy.Collections.filter);
	for (var i = 0; i < filters.length; i++) {
		filterTabIds.push(filters[i].toString());
	}
	Ti.API.info("All tab ids: " + filterTabIds);
}

function createEmptyFilterKeysInOrderedPostsDict(dictOrderedPosts, selectedFilters) {
	for (var i = 0; i < selectedFilters.length; i++) {
		dictOrderedPosts[selectedFilters[i]] = [];
	}
	return dictOrderedPosts;
}

function showDefaultError() {
	Ti.API.info("Adding error");
	var objectArgs = {
		top : "0",
		height : "250dip",
		layout : "vertical"
	};
	var view = viewService.createCustomView(objectArgs);
	objectArgs = {
		text : "You forgot to select filters! To do so,",
		textAlign : "center"
	};
	var label = labelService.createCustomLabel(objectArgs);
	objectArgs = {
		title : "Tap Here"
	};
	var button = buttonService.createCustomButton(objectArgs);
	objectArgs = {
		text : "Otherwise turn off filtering from the menu above.",
		textAlign : "center"
	};
	var labelToggle = labelService.createCustomLabel(objectArgs);
	button.addEventListener("click", function(e) {
		openFilterModal(e);
	});
	view.add(label);
	view.add(button);
	view.add(labelToggle);
	$.scrollView.add(view);
}

function openFilterModal(e) {
	Alloy.Models.app.set('customizeLearningSet', true);
	Alloy.createController('filterActivationModal').getView().open();
	Alloy.Globals.navController.toggleMenu(false);
}

function removePostsThatAreHiddenInKioskMode(dictPosts) {
	var sections = filter.returnDictKeys(dictPosts);
	for (var i = 0; i < sections.length; i++) {
		var posts = dictPosts[sections[i]];
		var tempAry = [];
		for (var j = 0; j < posts.length; j++) {
			var post = posts[j];
			if (!post.hide_in_kiosk_mode) {
				tempAry.push(post);
			}
		}
		dictPosts[sections[i]] = tempAry;
	}
	return dictPosts;
}

function insertXNumberOfButtons(numberOfButtons) {
	parentObjects = [];
	var objectArgs;
	objectArgs = {
		borderRadius : 0,
		backgroundColor : '#343434 ',
		width : '100%',
		top : "0",
		height : "50dip",
		layout : 'horizontal',
		horizontalWrap: false,
		scrollType: 'horizontal',
		id : 'buttonHolderView'
	};
	var buttonHolderView = viewService.createCustomScrollView(objectArgs);
	$.scrollView.add(buttonHolderView);

	if (numberOfButtons <= buttonLimit) {
		var each_button_width = (Math.floor(100 / numberOfButtons) - 1);
		each_button_width += '%';
	} else {
		each_button_width = buttonMaxWidth;
	}

	for (var i = 0; i < numberOfButtons; i++) {
		objectArgs = {
			title : filterTabIds[i],
			width : each_button_width,
			height : "50dip",
			borderColor : '#5a5a5a',
			// borderRadius : "10dip",
			backgroundColor : '#747474',
			color : '#FFFFFF',
			id : "button" + i,
			left : '1%',
			viewAssociatedId : filterTabIds[i]
		};
		var button = buttonService.createCustomButton(objectArgs);
		if (button.title == "0") {
			button.title = allInclusiveTabTitle;
		}
		objectArgs = {
			// borderRadius : "30dip",
			backgroundColor : '#FFFFFF',
			width : '100%',
			height : '0',
			visible : false,
			layout : "vertical",
			id : filterTabIds[i]
		};
		var view = viewService.createCustomView(objectArgs);
		keepFirstViewOpen(view, button, i);
		parentObjects.push(view);
		$.scrollView.add(view);

		button.addEventListener('click', function(e) {
			Ti.API.info("Visible view: " + JSON.stringify(e.source.viewAssociatedId));
			changeButtonColor(e.source);
			showRespectiveView(e.source);
		});
		buttonHolderView.add(button);
	}
	hideButtonViewIfOnlyOneButton(buttonHolderView, numberOfButtons);

	for (var i = 0; i < parentObjects.length; i++) {
		Ti.API.info("Added View (ID): " + JSON.stringify(parentObjects[i].id));
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
		button.backgroundColor = '#FFFFFF';
		button.color = '#747474';
		lastSelectedButton = button;
		firstView = view;
		lastSelectedView = 1;
	}
}

function changeButtonColor(buttonId) {
	if (lastSelectedButton) {
		lastSelectedButton.backgroundColor = '#747474';
		lastSelectedButton.color = '#FFFFFF';
	}
	buttonId.backgroundColor = '#FFFFFF';
	buttonId.color = '#747474';
	lastSelectedButton = buttonId;
}

function hideButtonViewIfOnlyOneButton(buttonHolderView, numberOfButtons) {
	if (numberOfButtons == 1) {
		buttonHolderView.height = "0";
		buttonHolderView.visible = false;
	}
}

function openFirstView(view) {
	view.visible = true;
	view.height = Ti.UI.SIZE;
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
