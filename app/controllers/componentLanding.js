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
var gradientColors = Alloy.Globals.colors.sectionPrimaryColors;

var gradientColorsCount = 0;
if (args[0]) {
	var url = Alloy.Globals.rootWebServiceUrl + "/component/" + args[0].get('id');
}

var rootDirPath = ( typeof Titanium == 'undefined') ? '../../lib/' : '';
var dataRetriever = require(rootDirPath + 'dataRetriever/dataRetriever');

var loadingSpinner = require(rootDirPath + 'loadingSpinner/loadingSpinner');
var spinner = new loadingSpinner();
var labelService = require(rootDirPath + 'customCalls/labelService');
labelService = new labelService();
var detectDevice = require(rootDirPath + 'customCalls/deviceDetectionService');
detectDevice = new detectDevice();

Ti.App.addEventListener("kioskMode:kioskModeChanged", function(e) {
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

var horizontalBuffer = "10dip";

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
       var imageWidth = calculateImageWidth();
       var image = Ti.UI.createImageView({
             top : horizontalBuffer,
             image : imageUrl,
             width : imageWidth,
             left : horizontalBuffer,
             right : horizontalBuffer,
       });
       $.scrollView.add(image);
}

function calculateImageWidth() {
       var screenWidth = convertPxToDipIfNecessary(detectDevice.getWidth());
       var horizBuffer = stripUnitsOffMeasurement(horizontalBuffer);
       var imageWidth = screenWidth - 2 * horizBuffer;
       imageWidth += "dip";
       return imageWidth;
}

function convertPxToDipIfNecessary(pxOrDip) {
       var dip = pxOrDip;
       if (OS_ANDROID) {
             dip = detectDevice.pxToDip(pxOrDip);
       }
       return dip;
}

function stripUnitsOffMeasurement(str) {
       var num = parseInt(str);
       return num;
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

		gradientColorsIndex = gradientColorsCount % gradientColors.length;
		var view = Titanium.UI.createView({
			height : '55dip',
			left : horizontalBuffer,
			right : horizontalBuffer,
			top : '5dip',
			bottom : '5dip',
			backgroundColor : gradientColors[gradientColorsIndex],
			sectionIndex : gradientColorsCount,
			layout : 'horizontal'
		});

		if (i == 0) {
			addExtraSpaceToFirstButton(view);
		}

		addEvent(view, orderedSectionList[i].key, rawJson);

		objectArgs = {
			color : 'white',
			textAlign : 'left',
			height : Ti.UI.FILL,
			text : orderedSectionList[i].key,
			left : "5%",
			width : Ti.UI.FILL,
			font : {

				fontSize : labelService.countCharInTitleAndReturnFontSize(orderedSectionList[i].key, 26, 20, 5, 3),
				fontWeight : "bold",
				fontFamily : Alloy.Globals.defaultGlobalFontFamily
			}
		};
		var label = labelService.createCustomLabel(objectArgs);
		if (detectDevice.isTablet()) {
			label.font = {

				fontSize : labelService.countCharInTitleAndReturnFontSize(orderedSectionList[i].key, 35, 30, 5, 3),
				fontWeight : "bold",
				fontFamily : Alloy.Globals.defaultGlobalFontFamily
			};
		}
		view.add(label);
		gradientColorsCount++;
		$.scrollView.add(view);
	}
}

function addExtraSpaceToFirstButton(view) {
	view.top = horizontalBuffer;
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
	var controller = Alloy.createController('sectionLanding', eval([args[0], sectionPosts, title, view.sectionIndex, analyticsTitle]));
	controller.setAnalyticsPageTitle(analyticsTitle);
	controller.setAnalyticsPageLevel(analyticsLevel);
	Alloy.Globals.navController.open(controller);
}

function getAllPostsForGivenSectionName(sectionName, rawJson) {
	var jsonToReturn = [];
	for (var i = 0; i < rawJson.posts.length; i++) {
		if (rawJson.posts[i].section == sectionName) {
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
	$.scrollView.height = Ti.UI.SIZE;

}

jackOfAllTrades();
