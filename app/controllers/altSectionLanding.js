/*
 * TODO
 * Refactor...
 * --Move all non-UI to separate file
 */
var args = arguments[0] || {};
var component = args;
var componentID = component.get('id');
var url = Alloy.Globals.rootWebServiceUrl + "/component/" + componentID;

var dictOrderedPostsBySection = {};
var dictOrderedPostsByAge = {};
var selectedAges;

var allPosts;
var initialLoad = true;
var genericAllAgesSectionTitle = "For Everyone in Your Group";
var noContentMessage = "Sorry!\n\nLooks like we're still in the process of adding content here.\n\nCheck here later for new and exciting activities!";
var noFiltersSelected = "Please select an age filter to see your sorted content!";

var dataRetriever = setPathForLibDirectory('dataRetriever/dataRetriever');
var viewService = setPathForLibDirectory('customCalls/viewService');
var view = new viewService();
var labelService = setPathForLibDirectory('customCalls/labelService');
var label = new labelService();
var loadingSpinner = setPathForLibDirectory('loadingSpinner/loadingSpinner');
var spinner = new loadingSpinner();

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

Alloy.Models.app.on("change:customizeLearningEnabled", detectEventEnabled);
Alloy.Models.app.on("change:customizeLearningSet", detectEventSet);
var ageFilterOn = Alloy.Models.app.get("customizeLearningEnabled");
var ageFilterSet = Alloy.Models.app.get("customizeLearningSet");

function setPathForLibDirectory(libFile) {
	if ( typeof Titanium == 'undefined') {
		lib = require("../../lib/" + libFile);
	} else {
		lib = require(libFile);
	}
	return lib;
};

function changeTitleOfThePage(name) {
	$.container.title = name;
}

function goToPostLandingPage(e) {
	var post = fetchPostById(e.source.itemId);
	var analyticsTitle = component.getScreenName() + '/' + post.name;
	var analyticsLevel = "Post Landing";
	var controller = Alloy.createController('postLanding', post);
	controller.setAnalyticsPageTitle(analyticsTitle);
	controller.setAnalyticsPageLevel(analyticsLevel);
	Alloy.Globals.navController.open(controller);
}

function checkPostViewSpacing() {
	if (OS_IOS) {
		$.scrollView.bottom = "48dip";
	}
}

function clearOrderedPostDicts() {
	dictOrderedPostsBySection = {};
	dictOrderedPostsByAge = {};
	$.scrollView.removeAllChildren();
}

function detectEventEnabled() {
	ageFilterOn = Alloy.Models.app.get("customizeLearningEnabled");
	//Ti.API.info("Filter Status 2: " + JSON.stringify(Alloy.Collections.filter));
	//Ti.API.info("Filter Detected (Comp): set: " + ageFilterSet + ", on: " + ageFilterOn);
	clearOrderedPostDicts();
	retrieveComponentData();
}

function detectEventSet() {
	ageFilterSet = Alloy.Models.app.get("customizeLearningSet");

	Ti.API.info("altSectionLanding Accessed");

	detectEventEnabled();
}

function retrieveComponentData() {
	clearOrderedPostDicts();
	addSpinner();
	if (initialLoad) {
		dataRetriever.fetchDataFromUrl(url, function(returnedData) {
			changeTitleOfThePage(returnedData.data.component.name);
			allPosts = returnedData.data.component.posts;
			initialLoad = false;
			checkIfAgeFilterOn(allPosts);
			checkPostViewSpacing();
		});
	} else {
		checkIfAgeFilterOn(allPosts);
		checkPostViewSpacing();
	}
	removeSpinner();
}

function addSpinner() {
	spinner.addTo($.container);
	spinner.show();
}

function removeSpinner() {
	spinner.hide();
}

function checkIfAgeFilterOn(allPosts) {
	if (ageFilterOn) {
		Ti.API.info("Filtering content");
		organizeByAge(allPosts);
	} else {
		Ti.API.info("Organizing content by section");
		organizeBySection(allPosts);
	}
}

function organizeBySection(allPosts) {
	dictOrderedPostsBySection = {};
	for (var i = 0; i < allPosts.length; i++) {
		compileDictOfSections(allPosts[i], dictOrderedPostsBySection);
	}

	sortPostsIntoSections(dictOrderedPostsBySection);

	Ti.API.info("Finished Organizing by Section");
	checkPostViewSpacing();
}

function compileDictOfSections(post, dict) {
	if (post.section) {
		sectionArray = parseStringIntoArray(post.section,", ");
		for (var i = 0; i < sectionArray.length; i++) {
			//Accounts for multiple sections per post
			addItemArrayToDict(sectionArray[i], post, dict);
		}
	}
	
}

function organizeByAge(allPosts) {
	dictOrderedPostsByAge = {};
	//Ti.API.info("Filter Status 3: " + JSON.stringify(Alloy.Collections.filter));
	selectedAges = parseFilterDictIntoArray(JSON.stringify(Alloy.Collections.filter));
	Ti.API.info("Age Filter: " + JSON.stringify(selectedAges));

	for (var i = 0; i < allPosts.length; i++) {
		compileDictOfSelectedAgesToPostAgeRange(selectedAges, dictOrderedPostsByAge, allPosts[i]);
	}
	dictOrderedPostsByAge = replaceDictKeysWithFilterHeadings(dictOrderedPostsByAge);
	sortPostsIntoSections(dictOrderedPostsByAge);

	Ti.API.info("Finished Filtering by Age");
	checkPostViewSpacing();
}

function returnDictKeys(dict) {
	var listKeys = [];
	for (key in dict) {
		listKeys.push(key);
	}
	return listKeys;
}

function checkIfArrayInArray(arySmall, aryLarge) {
	var lengthSmall = arySmall.length;
	var lengthLarge = aryLarge.length;
	var copySmall = [];

	if (lengthSmall == 1) {
		return false;
	} else {
		for (var i = 1; i < lengthSmall; i++) {
			copySmall.push(arySmall[i]);
		}
	}
	lengthSmall = copySmall.length;
	//Ti.API.info("small: " + JSON.stringify(copySmall) + ", large: " + JSON.stringify(aryLarge));
	if (checkIfAbbrevArray(aryLarge)) {
		return true;
	}
	if (JSON.stringify(copySmall) == JSON.stringify(aryLarge)) {
		return true;
	}
	if (lengthSmall > lengthLarge) {
		return false;
	}

	for (var i = 0; i < lengthSmall; i++) {
		for (var j = 0; j < lengthLarge; j++) {
			//	Ti.API.info("hold-find: " + copySmall[i] + "(" + i + ") -" + aryLarge[j] + "(" + j + ")");
			if (aryLarge[j] == copySmall[i]) {
				if (i == lengthSmall - 1) {
					return true;
				}
				break;
			} else if (j == lengthLarge - 1) {
				return false;
			}
		}
	}
	return false;
}

function checkIfAbbrevArray(ary) {
	if (ary.length == 1 && ary[0] == "0") {
		return true;
	}
	return false;
}

function compileDictOfSelectedAgesToPostAgeRange(selectedAges, dictOrderedPostsByAge, post) {
	var postAgeRange = repairEmptyAgeRange(post.age_range);
	postAgeRange = parseStringIntoArray(String(postAgeRange), ", ");
	if (checkIfArrayInArray(selectedAges, postAgeRange) && selectedAges.length != 2) {
		addItemArrayToDict("0", post, dictOrderedPostsByAge);
	} else if (checkIfAbbrevArray(postAgeRange) && selectedAges.length != 2) {
		addItemArrayToDict("0", post, dictOrderedPostsByAge);
	} else {
		for (var i = 0; i < selectedAges.length; i++) {
			var itemArray = createPostArray(postAgeRange, selectedAges[i], post);
			addItemArrayToDict(selectedAges[i], itemArray, dictOrderedPostsByAge);
		}
	}
}

function addItemArrayToDict(key, itemArray, dict) {
	if (JSON.stringify(itemArray) != ["0"]) {
		if (dict[key]) {
			dict[key] = dict[key].concat(itemArray);
		} else {
			dict[key] = [].concat(itemArray);
		}
	} else {
		Ti.API.info("Empty Array prevented: " + JSON.stringify(itemArray));
	}
}

function createPostArray(postAgeRange, selectedAge, post) {
	var itemArray = [];
	for (var i = 0; i < postAgeRange.length; i++) {
		if (postAgeRange[i] == selectedAge) {
			itemArray.push(post);
		}
	}
	return itemArray;
}

function repairEmptyAgeRange(ageRange) {
	if (ageRange == "a:0:{}") {
		return "0";
	} else {
		return ageRange;
	}
}

function parseStringIntoArray(st, deliniator) {
	var output;
	if (deliniator.length >= String(st).length) {
		return st.split();
	} else {
		for (var i = 0; i < st.length - deliniator.length + 1; i++) {
			if (st.substring(i, i + deliniator.length) == deliniator) {
				return st.split(deliniator);
			}
		}
		return st.split();
	}
}

function replaceStringWithFilterHeading(st) {
	var newSt = "";
	if (st == "0") {
		newSt = genericAllAgesSectionTitle;
	} else if (st.toLowerCase() == "adult") {
		newSt = "For " + st + "s";
	} else if (!Alloy.Globals.isNumber(st[0])) {
		newSt = "For " + st;
	} else if (Alloy.Globals.isNumber(st[0])) {
		newSt = "For my " + st + " year old";
	}
	return newSt;
}

function replaceDictKeysWithFilterHeadings(oldDict) {
	var oldKeys = returnDictKeys(oldDict);
	var newKeys = [];
	var newDict = {};
	for (var i = 0; i < oldKeys.length; i++) {
		newKeys.push(replaceStringWithFilterHeading(oldKeys[i]));
	}
	for (var i = 0; i < oldKeys.length; i++) {
		newDict[newKeys[i]] = oldDict[oldKeys[i]];
	}
	return newDict;
}

function sortPostsIntoSections(dict) {
	var dictKeys = returnDictKeys(dict);
	var dictLength = dictKeys.length;
	var bolEmpty;

	if (dictLength == 0) {
		var error = label.createLabel(noContentMessage);
		var errorView = view.createView();
		errorView.add(error);
		$.scrollView.add(errorView);
	} else if (dictLength == 1 && dict[genericAllAgesSectionTitle] == "") {
		var error = label.createLabel(noFiltersSelected);
		error.top = "0";
		var errorView = view.createView();
		errorView.add(error);
		$.scrollView.add(errorView);
	} else {
		for (var i = 0; i < dictLength; i++) {
			//cycle through dict keys
			var postCollection = Alloy.createCollection('post');
			stepIntoDict(dict, dictKeys[i], postCollection);
			//Ti.API.info("section: " + JSON.stringify(dictKeys[i]) + ", postCollection: " + JSON.stringify(postCollection));
			if (dictKeys[i] == genericAllAgesSectionTitle) {
				if (JSON.stringify(postCollection) != "[]") {
					args = {
						posts : postCollection
					};
					bolEmpty = "false";
					addPostScroller(i, dictKeys[i], dictLength, postCollection, bolEmpty);
				}
			} else if (dictKeys[i] != genericAllAgesSectionTitle) {
				if (JSON.stringify(postCollection) != "[]") {
					args = {
						posts : postCollection
					};
					bolEmpty = "false";
					addPostScroller(i, dictKeys[i], dictLength, postCollection, bolEmpty);
				} else {
					args = "";
					bolEmpty = "true";
					addPostScroller(i, dictKeys[i], dictLength, postCollection, bolEmpty);
				}
			}
		}
	}
}

function addPostScroller(i, title, dictLength, postCollection, bolEmpty) {
	var view = createPostScroller(title, postCollection);
	view = adjustViewHeight(view, i, dictLength, bolEmpty);
	$.scrollView.add(view);
}

function createPostScroller(title, postCollection) {
	var postScroller = Alloy.createController('postScroller', args);
	postScroller.sectionTitle.text = title;
	return postScroller.getView();
}

function adjustViewHeight(view, i, dictLength, bolEmpty) {
	var tempView = view;
	tempView.top = "0";
	if (bolEmpty == "false") {
		if (OS_IOS) {
			tempView.height = "60%";
		} else {
			tempView.height = "340dip";
		}
	} else {
		tempView.height = "150dip";
	}
	if (i == dictLength - 1) {
		tempView.bottom = "60dip";
	}
	return tempView;
}

function stepIntoDict(dict, key, postCollection) {
	//This level is a list of dictionaries
	var dictList = dict[key];
	for (var i = 0; i < dictList.length; i++) {
		//send single dictionary
		dict = dictList[i];
		stepIntoPostDictionaryCollection(dict, postCollection);
	}
}

function stepIntoPostDictionaryCollection(dict, postCollection) {
	//This level is a single dictionary
	var length = returnDictKeys(dict).length;
	var post = Alloy.createModel('post');
	post.set({
		name : retrieveValue(dict, "name"),
		image : retrieveValue(dict, "image"),
		rawJson : dict
	});
	postCollection.add(post);
}

function retrieveValue(dict, key) {
	if (dict[key]) {
		return dict[key];
	} else {
		return "";
	}
}

function parseFilterDictIntoArray(ary) {
	var newAry = ["0"];
	ary = JSON.parse(ary);
	for (var i = 0; i < ary.length; i++) {
		var dict = ary[i];
		//	Ti.API.info("Active: " + dict["name"] + " is " + dict["active"]);
		if (dict["active"].toString() == "true") {
			newAry.push(dict["name"]);
		}
	}
	//Ti.API.info("Returning: " + JSON.stringify(newAry));
	return newAry;
}

detectEventSet();
