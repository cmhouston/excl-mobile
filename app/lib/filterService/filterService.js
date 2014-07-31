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

var labelService = setPathForLibDirectory('customCalls/labelService');
labelService = new labelService();
var viewService = setPathForLibDirectory('customCalls/viewService');
viewService = new viewService();

var allInclusiveTabTitle;
var dictSortedPostsLength;
var errorEmptyAllInclusive = "If you have more than one age selected, this tab will hold the content that matches all of the ages of your group members.";
var errorEmptyTab = "";
var sectionScreenName = "";
var sectionLandingObjects;

function setPathForLibDirectory(libFile) {
	if ( typeof Titanium == 'undefined') {
		lib = require("../../lib/" + libFile);
	} else {
		lib = require(libFile);
	}
	return lib;
};

function filterService() {
};

filterService.prototype.setAllInclusiveTabTitle = function(st) {
	allInclusiveTabTitle = st;
	errorEmptyTab = 'Looks like there is no unique content for this filter. It may have been moved to the "' + allInclusiveTabTitle + '" tab above, check there!';
};

filterService.prototype.setSectionLandingObjects = function(ary) {
	sectionLandingObjects = ary;
};

filterService.prototype.parseStringIntoArray = function(st, deliniator) {
	var output;
	if ( st instanceof Array) {
		return st;
	}
	st = String(st);
	if (deliniator.length >= st.length) {
		return st.split();
	} else {
		for (var i = 0; i < st.length - deliniator.length + 1; i++) {
			if (st.substring(i, i + deliniator.length) == deliniator) {
				return st.split(deliniator);
			}
		}
		return st.split();
	}
};

filterService.prototype.sortPostIntoApplicableSection = function(filterSectionsForPost, selectedSection, post) {
	var itemArray = [];
	for (var i = 0; i < filterSectionsForPost.length; i++) {
		if (filterSectionsForPost[i] == selectedSection) {
			itemArray.push(post);
		}
	}
	return itemArray;
};

filterService.prototype.addItemArrayToDict = function(key, itemArray, dict) {
	if (JSON.stringify(itemArray) != ["0"]) {
		if (dict[key]) {
			dict[key] = dict[key].concat(itemArray);
		} else {
			dict[key] = [].concat(itemArray);
		}
	} else {
		Ti.API.info("Empty Array prevented: " + JSON.stringify(itemArray));
	}
};

filterService.prototype.checkIfArrayInArray = function(arySmall, aryLarge) {
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
	if (filterService.prototype.checkIfArrayHasOnlyZero(aryLarge)) {
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
};

filterService.prototype.checkIfArrayHasOnlyZero = function(ary) {
	if (ary.length == 1 && ary[0] == "0") {
		return true;
	}
	return false;
};

filterService.prototype.replaceEmptyArrayWithAllFilters = function(ary, postId) {
	if (ary == "a:0:{}") {
		Ti.API.info("!!!Warning!!! Post ID " + postId + " has invalid filters. Replace with all filters.");
		newAry = [];
		newAry = filterService.prototype.formatAllFiltersIntoArray(Alloy.Collections.filter);
		return newAry;
	} else {
		return ary;
	}
};

filterService.prototype.returnDictKeys = function(dict) {
	var listKeys = [];
	for (key in dict) {
		listKeys.push(key);
	}
	return listKeys;
};

filterService.prototype.sortPostsIntoTabs = function(dict, parentObjectArray) {
	var dictKeys = filterService.prototype.returnDictKeys(dict);
	var dictLength = dictKeys.length;
	dictSortedPostsLength = dictLength;

	Ti.API.info("All Sections: " + JSON.stringify(dictKeys));
	for (var j = 0; j < parentObjectArray.length; j++) {
		//Cycle through tabs
		for (var i = 0; i < dictLength; i++) {
			//Cycle through sections. Match tab ID to section ID
			var sectionMatchedToParent = false;
			Ti.API.info("Tab " + j + "- Parent obj: " + JSON.stringify(parentObjectArray[j].id) + ", Section: " + JSON.stringify(dictKeys[i]));
			if (parentObjectArray[j].id == dictKeys[i] && !sectionMatchedToParent) {
				var postCollection = filterService.prototype.retrievePostDetails(dict, dictKeys[i]);
				Ti.API.info("--Section and object id match.");
				filterService.prototype.addPostsToViewAccordingToSection(dictKeys[i], dict, parentObjectArray[j], postCollection);
				sectionMatchedToParent = true;
				i = dictLength;
			} else if (i == dictLength && !sectionMatchedToParent) {
				var postCollection = filterService.prototype.retrievePostDetails(dict, dictKeys[i]);
				Ti.API.info("--Section and object id do not match for all pairs. Add to 0.");
				filterService.prototype.addPostsToViewAccordingToSection(dictKeys[i], dict, parentObjectArray[0], postCollection);
			} else {
				Ti.API.info("--Section and object id do not match. Skip.");
			}
		}
	}

};

filterService.prototype.generateErrorMessage = function(msg) {
	var objectArgs = {
		text : msg,
		color : "black",
		font : {
			color : "black",
			fontSize : "20dip"
		}
	};
	var error = labelService.createCustomLabel(objectArgs);
	objectArgs = {
		top : "0",
		height : "200dip",
		width : "90%"
	};
	var errorView = viewService.createCustomView(objectArgs);
	errorView.add(error);
	return errorView;
};

filterService.prototype.retrievePostDetails = function(dict, sections) {
	var postCollection = Alloy.createCollection('post');
	filterService.prototype.exploreListOfPosts(dict, sections, postCollection);
	//Ti.API.info("Section: " + JSON.stringify(sections) + ", Post(s): " + JSON.stringify(postCollection));
	return postCollection;
};

filterService.prototype.exploreListOfPosts = function(dict, key, collectionOfPosts) {
	//This level is a list of dictionaries
	var dictList = dict[key];
	for (var i = 0; i < dictList.length; i++) {
		dict = dictList[i];
		filterService.prototype.explorePost(dict, collectionOfPosts);
	}
};

filterService.prototype.explorePost = function(dict, postCollection) {
	//This level is a single dictionary (The post)
	var post = Alloy.createModel('post');
	post.set({
		name : filterService.prototype.retrieveKeyValue(dict, "name"),
		image : filterService.prototype.retrieveKeyValue(dict, "image"),
		text : filterService.prototype.retrieveTextPart(dict["parts"]),
		rawJson : dict
	});
	postCollection.add(post);
};

filterService.prototype.retrieveKeyValue = function(dict, key) {
	if (dict[key]) {
		return dict[key];
	} else {
		return "";
	}
};

filterService.prototype.retrieveTextPart = function(partsList) {
	var length = partsList.length;
	var previewText;
	for (var i = 0; i < length; i++) {
		//single part
		partDict = partsList[i];
		if (partDict["type"] == "text") {
			previewText = partDict["body"];
			return previewText;
		}
	}
};

filterService.prototype.formatActiveFiltersIntoArray = function(ary) {
	var newAry = [];
	ary = ary.toJSON();
	for (var i = 0; i < ary.length; i++) {
		if (ary[i].active == true) {
			newAry.push(ary[i].name);
		}
	}
	return newAry;
};

filterService.prototype.formatAllFiltersIntoArray = function(ary) {
	var newAry = [];
	ary = ary.toJSON();
	for (var i = 0; i < ary.length; i++) {
		newAry.push(ary[i].name);
	}
	return newAry;
};

filterService.prototype.sortFilteredContentIntoDict = function(selectedFilters, dictOrderedPosts, post) {
	var postFilterCategories = filterService.prototype.replaceEmptyArrayWithAllFilters(post.age_range, post.id);
	postFilterCategories = filterService.prototype.parseStringIntoArray(postFilterCategories, ", ");
	if (JSON.stringify(selectedFilters) != "[]") {
		if (filterService.prototype.checkIfArrayInArray(selectedFilters, postFilterCategories)) {
			Ti.API.info("Post ID " + post.id + " has includes all of the selected filters. Add to 0.");
			filterService.prototype.addItemArrayToDict("0", post, dictOrderedPosts);
		} else if (filterService.prototype.checkIfArrayHasOnlyZero(postFilterCategories)) {
			Ti.API.info("Post ID " + post.id + " has all possible filters. Add to 0.");
			filterService.prototype.addItemArrayToDict("0", post, dictOrderedPosts);
		} else {
			for (var i = 0; i < selectedFilters.length; i++) {
				var itemArray = filterService.prototype.sortPostIntoApplicableSection(postFilterCategories, selectedFilters[i], post);
				if (Alloy.Models.app.get("customizeLearningEnabled")) {
					Ti.API.info("Filtering enabled. Add post to filter section.");
					filterService.prototype.addItemArrayToDict(selectedFilters[i], itemArray, dictOrderedPosts);
				} else {
					Ti.API.info("Filtering not set. Add to 0.");
					filterService.prototype.addItemArrayToDict("0", itemArray, dictOrderedPosts);
				}
			}
		}
	}
};

filterService.prototype.addPostsToViewAccordingToSection = function(section, dict, parentObject, collectionOfPosts) {
	var scrollView = sectionLandingObjects[0];
	var buttonHolderView = sectionLandingObjects[1];
	var allTabView = sectionLandingObjects[2];
	var allTabButton = sectionLandingObjects[3];
	var postData = {
		posts : collectionOfPosts,
		parentScreenName : sectionScreenName,
		allInclusiveTabTitle : allInclusiveTabTitle
	};
	if (section == "0") {
		if (JSON.stringify(postData.posts) != "[]") {
			Ti.API.info("--All inclusive tab found with content. Add content.");
			filterService.prototype.addPostPreview(postData, parentObject);
		} else {
			Ti.API.info("--All inclusive tab empty. Remove Tab.");
			if (dictSortedPostsLength > 1) {
				//parentObject.add(filterService.prototype.generateErrorMessage(errorEmptyAllInclusive));
				buttonHolderView.remove(allTabButton);
				scrollView.remove(allTabView);
			}
		}
	} else {
		if (JSON.stringify(postData.posts) != "[]") {
			Ti.API.info("--Other tab found with content. Add content.");
			filterService.prototype.addPostPreview(postData, parentObject);
		} else {
			Ti.API.info("--Other tab found without content. Throw message.");
			parentObject.add(filterService.prototype.generateErrorMessage(errorEmptyTab));
		}
	}
};

filterService.prototype.addPostPreview = function(postData, parentObject) {
	var postPreview = Alloy.createController('postPreview', eval([postData, allInclusiveTabTitle]));
	var view = postPreview.getView();
	parentObject.add(view);
};

filterService.prototype.setSectionScreenName = function(name) {
	sectionScreenName = name;
};

module.exports = filterService;
