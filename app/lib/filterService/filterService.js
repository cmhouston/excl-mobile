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

var allInclusiveFilter;
var errorNoContent = "Sorry!\n\nLooks like we're still in the process of adding content here.\n\nCheck here later for new and exciting activities!";
var errorFilterSelectionHasNoResults = "Your selected filters aren't returning any activities! Try selected some different ones.";
var sectionScreenName = "";

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

filterService.prototype.setAllInclusiveFilter = function(st) {
	var allInclusiveFilter = st;
};

filterService.prototype.parseStringIntoArray = function(st, deliniator) {
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

	//Ti.API.info("arySmall: " + JSON.stringify(arySmall));
	//Ti.API.info("aryLarge: " + JSON.stringify(aryLarge));

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

filterService.prototype.replaceEmptyArrayWithZero = function(ary) {
	if (ary == "a:0:{}") {
		return ["0"];
	} else {
		return ary;
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

filterService.prototype.replaceDictKeysWithFilterHeadings = function(oldDict) {
	var oldKeys = filterService.prototype.returnDictKeys(oldDict);
	var newKeys = [];
	var newDict = {};
	for (var i = 0; i < oldKeys.length; i++) {
		newKeys.push(filterService.prototype.replaceStringWithFilterHeading(oldKeys[i]));
	}
	for (var i = 0; i < oldKeys.length; i++) {
		newDict[newKeys[i]] = oldDict[oldKeys[i]];
	}
	return newDict;
};

filterService.prototype.returnDictKeys = function(dict) {
	var listKeys = [];
	for (key in dict) {
		listKeys.push(key);
	}
	return listKeys;
};

filterService.prototype.sortPostsIntoSections = function(dict, parentObjectArray) {
	var dictKeys = filterService.prototype.returnDictKeys(dict);
	var dictLength = dictKeys.length;

	if (dictLength == 0) {
		//No content found (no content that matches all filters). Throw Error.
		parentObjectArray[0].add(filterService.prototype.generateErrorMessage(errorNoContent));
	} else if (dictLength == 1 && dict[allInclusiveFilter] == "") {
		//Only all inclusive category thrown and its empty. Throw Error.
		parentObjectArray[0].add(filterService.prototype.generateErrorMessage(errorFilterSelectionHasNoResults));
	} else {
		//Content found. Build the posts. Cycle through the sections/dictKeys and the tab onto which it is added.

		Ti.API.info("All Sections: " + JSON.stringify(dictKeys));

		for (var j = 0; j < parentObjectArray.length; j++) {
			for (var i = 0; i < dictLength; i++) {
var sectionMatchedToParent = false;
				Ti.API.info("Tab " + j + "- Parent obj: " + JSON.stringify(parentObjectArray[j].id) + ", Section: " + JSON.stringify(dictKeys[i]));

				if (dictKeys[i]) {
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
						Ti.API.info("--Section and objct id do not match. Skip.");
					}
				} else {
					Ti.API.info("--Error: section is undefined.");
				}
			}
		}
	}
};

filterService.prototype.generateErrorMessage = function(msg) {
	var objectArgs = {
		text : msg
	};
	var error = labelService.createCustomLabel(msg);
	objectArgs = {
		top : "0"
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

	Ti.API.info("Format this: " + JSON.stringify(ary));

	for (var i = 0; i < ary.length; i++) {
		if (ary[i].active == true) {
			newAry.push(ary[i].name);
		}
	}
	Ti.API.info("Sending ary: " + newAry);
	return newAry;
};

filterService.prototype.sortFilteredContentIntoDict = function(selectedFilters, dictOrderedPostsByFilter, post) {
	var postFilterCategories = filterService.prototype.replaceEmptyArrayWithZero(post.age_range);
	postFilterCategories = filterService.prototype.parseStringIntoArray(String(postFilterCategories), ", ");
	if (filterService.prototype.checkIfArrayInArray(selectedFilters, postFilterCategories) && selectedFilters.length != 2) {
		Ti.API.info("All Selected Filters found in post registered filters. Add to 0.");
		filterService.prototype.addItemArrayToDict("0", post, dictOrderedPostsByFilter);
	} else if (filterService.prototype.checkIfArrayHasOnlyZero(postFilterCategories) && selectedFilters.length != 2) {
		Ti.API.info("Post has all registered filters. Add to 0.");
		filterService.prototype.addItemArrayToDict("0", post, dictOrderedPostsByFilter);
	} else {
		for (var i = 0; i < selectedFilters.length; i++) {
			var itemArray = filterService.prototype.sortPostIntoApplicableSection(postFilterCategories, selectedFilters[i], post);
			if (Alloy.Models.app.get("customizeLearningEnabled")) {
				filterService.prototype.addItemArrayToDict(selectedFilters[i], itemArray, dictOrderedPostsByFilter);
			} else {
				Ti.API.info("Filtering not set. Add to 0.");
				filterService.prototype.addItemArrayToDict("0", itemArray, dictOrderedPostsByFilter);
			}
		}
	}
};

filterService.prototype.addPostsToViewAccordingToSection = function(section, dict, parentObject, collectionOfPosts) {
	var postData;
	if (section == allInclusiveFilter) {
		if (JSON.stringify(collectionOfPosts) != "[]") {
			postData = {
				posts : collectionOfPosts,
				parentScreenName : sectionScreenName	// TODO
			};
			filterService.prototype.addPostPreview(postData, parentObject);
		}
	} else {
		if (JSON.stringify(collectionOfPosts) != "[]") {
			postData = {
				posts : collectionOfPosts,
				parentScreenName : sectionScreenName	// TODO
			};
			filterService.prototype.addPostPreview(postData, parentObject);
		} else {
			filterService.prototype.addPostPreview(postData, parentObject);
		}
	}
};

filterService.prototype.addPostPreview = function(postData, parentObject) {
	var postPreview = Alloy.createController('postPreview', postData);
	var view = postPreview.getView();
	parentObject.add(view);
};

filterService.prototype.setSectionScreenName = function(name) {
	sectionScreenName = name;
};

module.exports = filterService;
