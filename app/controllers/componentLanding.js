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

// fetch the data here
// component id is provided
// picture is provided
var args = arguments[0] || {};
var gradientColors = ["#2382ff", "#005CD5", "#004092", "#002257", "#00142D", "#000914"];
var gradientColorsCount = 0;
var url = Alloy.Globals.rootWebServiceUrl + "/component/" + args[0].get('id');

var rootDirPath = ( typeof Titanium == 'undefined') ? '../../lib/' : '';
var dataRetriever = require(rootDirPath + 'dataRetriever/dataRetriever');

var loadingSpinner = require(rootDirPath + 'loadingSpinner/loadingSpinner');
var spinner = new loadingSpinner();
var labelService = require(rootDirPath + 'customCalls/labelService');
labelService = new labelService();
var detectDevice = require(rootDirPath + 'customCalls/deviceDetectionService');
detectDevice = new detectDevice();

Ti.App.addEventListener("kioskMode:kioskModeChanged", function(e){
	Ti.API.info("Kiosk mode changed yo! => " + e.kioskMode);
});

/**
 * Analytics specific information
 */
var analyticsPageTitle = "Component Landing";
var analyticsPageLevel = "Component Landing";

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
// ----------------------------------------------------

$.onEnterKioskMode = function() {
	$.navBar.onEnterKioskMode();
};

$.onExitKioskMode = function() {
	$.navBar.onExitKioskMode();
};

function setPageTitle(name) {
	$.navBar.setPageTitle(name);
}

function hideMenuBtnIfKioskMode() {
	if (Alloy.Globals.adminModeController.isInKioskMode()) {
		$.navBar.hideMenuBtn();
	}
}

function insertComponentPicture(imageUrl) {
	Ti.API.info("Picture to insert ===> " + imageUrl.toString());

	var view = Titanium.UI.createView({
		height : '40%',
		left : '6dip',
		right : '6dip',
		top : '10dip',
		bottom : '20dip',
		layout : 'vertical'
	});

	var image = Ti.UI.createImageView({
		image : imageUrl,
		width : '100%',
		height : '100%'
	});
	view.add(image);
	$.scrollView.add(view);

}

function extractSectionNamesAndOrder(rawPostJson) {
	var allSectionNames = {};
	for (var i = 0; i < rawPostJson.length; i++) {
		if (allSectionNames.hasOwnProperty(rawPostJson[i].section) == false) {
			allSectionNames[rawPostJson[i].section] = convertSectionOrderToInteger(rawPostJson[i].section_order);
		}
	}
	return allSectionNames;
}


function convertSectionOrderToInteger(section_order) {
	if (section_order == true) {
		return 1;
	} else if (section_order == false) {
		return 0;
	} else {
		return parseInt(section_order);
	}
}

function orderSectionNameBySectionOrder(unorderedSectionNames) {
	var sectionNamesAray = covertHashMapIntoArrayOfObject(unorderedSectionNames);
	sectionNamesAray.sort(function(a, b) {
		return a.value - b.value;
	});
	return sectionNamesAray;
}

function covertHashMapIntoArrayOfObject(hashMap) {
	var arrayOfObjects = new Array();
	for (var each_key in hashMap) {
		arrayOfObjects.push({
			key : each_key,
			value : hashMap[each_key]
		});
	}
	return arrayOfObjects;
}

function displaySectionList(orderedSectionList, rawJson) {
	for (var i = 0; i < orderedSectionList.length; i++) {
		var objectArgs;

		var view = Titanium.UI.createView({
			height : '10%',
			left : '12dip',
			right : '12dip',
			top : '5dip',
			bottom : '5dip',
			backgroundColor : gradientColors[gradientColorsCount],
			layout : 'horizontal'
		});
		
		addEvent(view, orderedSectionList[i].key, rawJson);

		objectArgs = {
			color : 'white',
			textAlign : 'center',
			height : Ti.UI.FILL,
			text : orderedSectionList[i].key,
			left : "5%",
			font : {

				fontSize : labelService.countCharInTitleAndReturnFontSize(orderedSectionList[i].key, 26, 20, 5, 3),
				fontWeight : "bold"
			}
		};
		var label = labelService.createCustomLabel(objectArgs);
		if (detectDevice.isTablet()) {
			label.font = {

				fontSize : labelService.countCharInTitleAndReturnFontSize(orderedSectionList[i].key, 35, 30, 5, 3),
				fontWeight : "bold"
			};
		}
		view.add(label);
		gradientColorsCount++;
		$.scrollView.add(view);
	}
}

function addEvent(view, title, rawJson) {
	view.addEventListener("click", function() {
		openSection(view, title, rawJson);
	});
}

function openSection(view, title, rawJson) {
	var analyticsTitle = getAnalyticsPageTitle() + '/' + title;
	var analyticsLevel = "Section Landing";
	var sectionPosts = getAllPostsForGivenSectionName(title, rawJson);
	var controller = Alloy.createController('sectionLanding', eval([args[0], sectionPosts, title, view.backgroundColor, analyticsTitle]));
	controller.setAnalyticsPageTitle(analyticsTitle);
	controller.setAnalyticsPageLevel(analyticsLevel);
	Alloy.Globals.navController.open(controller);
}

function getAllPostsForGivenSectionName(sectionName, rawJson) {
	var jsonToReturn = [];
	for (var i = 0; i < rawJson.posts.length; i++) {
		if (rawJson.posts[i].section == sectionName){
			jsonToReturn.push(rawJson.posts[i]);
		}
	}
	return jsonToReturn;
}

function addSpinner() {
	spinner.addTo($.container);
	spinner.show();
}

function hideSpinner() {
	spinner.hide();
}

function jackOfAllTrades() {
	addSpinner();
	dataRetriever.fetchDataFromUrl(url, function(returnedData) {

		if (!dataRetriever.checkIfDataRetrieverNull(returnedData)) {
			var rawJson = eval(returnedData.data.component);
			setPageTitle(rawJson["name"]);
			hideMenuBtnIfKioskMode();
			insertComponentPicture(args[1]);
			var unorderedSectionNames = extractSectionNamesAndOrder(rawJson["posts"]);
			var orderedSectionList = orderSectionNameBySectionOrder(unorderedSectionNames);
			displaySectionList(orderedSectionList, rawJson);
			fixBottomSpacing();
		}
		hideSpinner();
	});
}

function fixBottomSpacing() {

	if (OS_IOS) {
		//$.scrollView.bottom = "48dip";
		//$.scrollView.top = "0";
	}
	$.scrollView.height = Ti.UI.FILL;

}

jackOfAllTrades();
