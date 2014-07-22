var args = arguments[0] || {};

var allPosts = eval(args[1]);
var selectedSection = args[2];
var sectionColor = args[3];

var dataRetriever = setPathForLibDirectory('dataRetriever/dataRetriever');
var loadingSpinner = setPathForLibDirectory('loadingSpinner/loadingSpinner');
var spinner = new loadingSpinner();
var filterService = setPathForLibDirectory('filterService/filterService');
var filter = new filterService();

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

function detectEventSet() {
	filterSet = Alloy.Models.app.get("customizeLearningSet");
	detectEventEnabled();
}

function detectEventEnabled() {
	filterOn = Alloy.Models.app.get("customizeLearningEnabled");
	//Ti.API.info("Filter Status 2: " + JSON.stringify(Alloy.Collections.filter));
	Ti.API.info("Filter Detected (Comp): set: " + filterSet + ", on: " + filterOn);
	retrieveComponentData();
	changeTitleOfThePage(selectedSection, sectionColor);
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
	filter.sortPostsIntoSections(dictOrderedPostsBySection, $.scrollView);
	Ti.API.info("Finished Organizing by Section");
}

function organizeByFilter(allPosts) {
	dictOrderedPostsByFilter = {};
	selectedFilters = filter.formatActiveFiltersIntoArray(JSON.stringify(Alloy.Collections.filter));
	Ti.API.info("Filter: " + JSON.stringify(selectedFilters));
	for (var i = 0; i < allPosts.length; i++) {
		filter.sortFilteredContentIntoDict(selectedFilters, dictOrderedPostsByFilter, allPosts[i]);
	}
	dictOrderedPostsByFilter = filter.replaceDictKeysWithFilterHeadings(dictOrderedPostsByFilter);
	filter.sortPostsIntoSections(dictOrderedPostsByFilter, $.scrollView);
	$.scrollView.height = Ti.UI.SIZE;
	Ti.API.info("Finished Filtering");
}

function changeTitleOfThePage(name, color) {
	$.navBar.setPageTitle(name);
	$.navBar.setBackgroundColor(color);
}

function goToPostLandingPage(e) {
	var post = fetchPostById(e.source.itemId);
	var analyticsTitle = component.getScreenName() + '/' + post.name;
	var analyticsLevel = "Post Landing";
	//currentTabGroup.remove();
	var controller = Alloy.createController('postLanding', post);
	controller.setAnalyticsPageTitle(analyticsTitle);
	controller.setAnalyticsPageLevel(analyticsLevel);
	Alloy.Globals.navController.open(controller);
}

detectEventSet();
