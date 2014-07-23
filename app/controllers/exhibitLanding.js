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

var json = Alloy.Globals.museumJSON;
Ti.API.info('Exhibit landing initialized with: ' + json);

var loadingSpinner = setPathForLibDirectory('loadingSpinner/loadingSpinner');
var addLoadingMessage = false;
var loadingSpinnerLib = new loadingSpinner(addLoadingMessage);
var spinner = loadingSpinnerLib.getSpinner();
var loadingSpinnerView = Ti.UI.createView();

var iconService = setPathForLibDirectory('customCalls/iconService');
var iconService = new iconService();

var buttonService = setPathForLibDirectory('customCalls/buttonService');
var buttonService = new buttonService();

var url = Alloy.Globals.rootWebServiceUrl;

var exhibitText = [];
var componentsInExhibit = [];
var currExhibitId;
var expanderButton;

var defaultComponentHeight = "190dip";
var ipadComponentHeight = "375dip";

//Analytics Specific Information -------------------
var analyticsPageTitle = "Exhibit Landing";
var analyticsPageLevel = "Exhibit Landing";

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
//---------------------------------------------------

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

function addSpinner() {
	loadingSpinnerView.add(spinner);
	spinner.show();
	$.exhibitLanding.add(loadingSpinnerView);
}

function hideSpinner() {
	spinner.hide();
	$.exhibitLanding.remove(loadingSpinnerView);
}

function fixIpadSpacing() {
	if (Titanium.Platform.osname == 'ipad') {
		$.exhibitSelect.bottom = "20dip";
		$.exhibitSelect.height = "70dip";
		$.exhibitSelectLabel.font = {
			fontSize : "25dip"
		};
		$.exhibitSelectLabel.width = "60%";
		$.exhibitSelectLabel.left = "20%";
		$.exhibitSelectLabel.height = "50dip";
	}
}

function init() {
	addSpinner();
	$.navBar.setPageTitle("Exhibitions");
	initializeWithJSON(json);
	fixIpadSpacing();
	hideSpinner();
}

function setAnalyticsPageTitle(title) {
	analyticsPageTitle = title;
}

function getAnalyticsPageTitle() {
	return analyticsPageTitle;
}

function setAnalyticsPageLevel(level) {
	analyticsPageLevel = level;
}

function getAnalyticsPageLevel() {
	return analyticsPageLevel;
}

function initializeWithJSON(json) {
	Alloy.Globals.analyticsController.setTrackerID(json.data.museum.tracking_id);
	populateWindow(json);
}

function populateWindow(json) {
	var components = Alloy.Collections.instance('component');
	for (var i = 0; i < json.data.museum.exhibits.length; i++) {
		var exhibit = json.data.museum.exhibits[i];
		for (var j = 0; j < exhibit.components.length; j++) {
			component = exhibit.components[j];
			var componentModel = Alloy.createModel('component');
			componentModel.set({
				'id' : component.id,
				'name' : component.name,
				'exhibit' : exhibit.name,
				'component_order' : component.component_order,
				'exhibit_order' : exhibit.exhibit_order
			});
			components.add(componentModel);
		}
	}
	createExhibitsCarousel(json.data.museum.exhibits);
	createExhibitSelect(json.data.museum.exhibits);
	createcollapsibleComponentView();
	createComponentsScrollView(json.data.museum.exhibits);
}

function createExhibitsCarousel(exhibits) {
	$.exhibitsCarousel.removeView($.placeholder);
	for ( i = 0; i < exhibits.length; i++) {
		exhibitText[i] = exhibits[i].long_description;
		var exhibitView;

		if (OS_IOS) {
			exhibitView = createExhibitsImageIOS(exhibits[i], (i + 1 + " of " + exhibits.length));
		} else if (OS_ANDROID) {
			exhibitView = createExhibitsImageAndroid(exhibits[i], (i + 1 + " of " + exhibits.length));
			exhibitView.addEventListener("click", function(e) {
				onExhibitsClick(exhibits);
			});
		}
		$.exhibitsCarousel.addView(exhibitView);
	}
	$.headingLabel.text = exhibits[0].name;
	$.exhibitInfoLabel.text = exhibits[0].long_description;
	if (Titanium.Platform.osname == "ipad") {
		$.headingLabel.font = {
			fontSize : "30dip",
			fontWeight : 'bold'
		};
		$.exhibitInfoLabel.font = {
			fontSize : "25dip"
		};
	}

	if (OS_IOS) {
		//Android doesn't respond to singletap event, so the Android event listener is added above
		$.exhibitsCarousel.addEventListener("singletap", function(e) {
			onExhibitsClick(exhibits);
		});
	}

	$.exhibitsCarousel.addEventListener("scrollend", function(e) {
		onExhibitsScroll(e, exhibits);
	});
}

function createExhibitsImageIOS(exhibit, pageXofYtext) {
	var viewConfig = {
		backgroundColor : "#253342",
		width : Ti.UI.FILL,
		image : '/images/700x400.png',
		itemId : exhibit.id
	};
	if (exhibit.exhibit_image) {
		viewConfig.image = exhibit.exhibit_image;
	}
	var exhibitView = Ti.UI.createImageView(viewConfig);
	// exhibitView.add(createExhibitTitleLabel(exhibit.name, pageXofYtext));
	return exhibitView;
}

function createExhibitsImageAndroid(exhibit, pageXofYtext) {

	var itemContainer = Ti.UI.createView({
		itemId : exhibit.id
	});
	var image = Ti.UI.createImageView({
		backgroundColor : "#253342",
		width : Ti.UI.FILL,
		image : '/images/700x400.png',
	});
	var clickCatcher = Ti.UI.createView({
		itemId : exhibit.id
	});
	image.image = exhibit.exhibit_image;

	itemContainer.add(image);
	// itemContainer.add(createTitleLabel(exhibit.name, '25dip', pageXofYtext));
	itemContainer.add(clickCatcher);
	return itemContainer;
}

function createExhibitTitleLabel(name, pageXofYtext) {
	var titleLabelView = Ti.UI.createView({
		top : 0,
		height : Ti.UI.SIZE,
		backgroundColor : '#000',
		opacity : 0.6
	});
	var label = Ti.UI.createLabel({
		top : 0,
		left : "3%",
		text : name,
		color : 'white',
		horizontalWrap : false,
		font : {
			fontFamily : 'Arial',
			fontSize : '24dip',
			fontWeight : 'bold'
		}
	});
	if (Titanium.Platform.osname == "ipad") {
		label.font = {
			fontSize : "30dip"
		};
	}
	titleLabelView.add(label);

	if (pageXofYtext) {
		var pageXofYtextLabel = Ti.UI.createLabel({
			top : "10%",
			right : "3%",
			text : pageXofYtext,
			color : 'white',
			horizontalWrap : false,
			font : {
				fontFamily : 'Arial',
				fontSize : '18dip',
				fontWeight : 'normal'
			}
		});
		titleLabelView.add(pageXofYtextLabel);
	}

	return titleLabelView;
}

function createTitleLabel(name, textSize, pageXofYtext) {
	var titleLabel = Ti.UI.createView({
		backgroundColor : 'black',
		opacity : 0.6,
		height : '15%',
		top : 0
	});

	var label = Ti.UI.createLabel({
		text : name,
		top : 0,
		left : 10,
		color : 'white',
		font : {
			fontFamily : 'Arial',
			fontSize : textSize,
			fontWeight : 'bold'
		}
	});
	if (Titanium.Platform.osname == "ipad") {
		label.font = {
			fontSize : "27dip",
			fontWeight : "bold"
		};
		titleLabel.height = Ti.UI.SIZE;
	}
	titleLabel.add(label);

	if (pageXofYtext) {
		var pageXofYtextLabel = Ti.UI.createLabel({
			top : "10%",
			right : "3%",
			text : pageXofYtext,
			color : 'white',
			horizontalWrap : false,
			font : {
				fontFamily : 'Arial',
				fontSize : '18dip',
				fontWeight : 'normal'
			}
		});
		titleLabel.add(pageXofYtextLabel);
	}

	return titleLabel;
}

function showScrollableViewArrows(scroller) {

	if (scroller.getViews().length > 0) {
		scroller.setCurrentPage(1);
	}
	//scroller.setCurrentPage(0);
}

function createcollapsibleComponentView() {
	$.collapsibleComponentView.hidden = true;
	$.collapsibleComponentView.height = 0;
}

function onExhibitsClick(exhibits) {
	$.exhibitInfoScrollView.scrollTo(0, 0);
	if ($.collapsibleComponentView.hidden == true) {
		$.collapsibleComponentView.hidden = false;
		var pageIndex = $.exhibitsCarousel.currentPage;
		$.exhibitSelectLabel.text = "Back to Description";
		$.exhibitInfoLabel.text = exhibits[pageIndex].long_description;
		if (Titanium.Platform.osname == "ipad") {
			$.exhibitInfoLabel.font = {
				fontSize : "25dip"
			};
			$.exhibitSelectLabel.font = {
				fontSize : "25dip"
			};
		}
		$.headingLabel.text = "Select an Activity from Below!";
		if (Titanium.Platform.osname == "ipad") {
			$.headingLabel.font = {
				fontSize : "30dip",
				fontWeight : 'bold'
			};
		}

		$.exhibitInfoScrollView.animate({
			opacity : 0,
			duration : 300
		});

		var slideOut = Ti.UI.createAnimation({
			height : defaultComponentHeight,
			duration : 300,
			curve : Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT
		});
		if (Titanium.Platform.osname == "ipad") {
			slideOut.height = ipadComponentHeight;
		}

		setTimeout(function() {
			$.exhibitInfoScrollView.height = 0;
		}, 300);

		$.collapsibleComponentView.height = defaultComponentHeight;
		if (Titanium.Platform.osname == "ipad") {
			$.collapsibleComponentView.height = ipadComponentHeight;
		}
		$.collapsibleComponentView.animate(slideOut);
	} else {
		$.collapsibleComponentView.hidden = true;
		$.headingLabel.text = exhibits[$.exhibitsCarousel.currentPage].name;
		$.exhibitSelectLabel.text = "Explore This Exhibition!";
		$.exhibitInfoScrollView.animate({
			opacity : 1,
			duration : 300
		});
		$.exhibitInfoScrollView.height = Ti.UI.SIZE;
		setTimeout(function() {
			$.exhibitInfoScrollView.height = Ti.UI.SIZE;
		}, 300);

		var slideIn = Ti.UI.createAnimation({
			height : '0dip',
			duration : 300,
			curve : Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT
		});
		$.collapsibleComponentView.animate(slideIn);
	}
}

function onExhibitsScroll(e, exhibits) {
	componentsInExhibit[currExhibitId].width = 0;
	componentsInExhibit[e.view.itemId].width = Ti.UI.SIZE;
	$.collapsibleComponentView.hidden = true;
	$.exhibitSelectLabel.text = "Explore This Exhibition!";
	currExhibitId = e.view.itemId;
	var index = $.exhibitsCarousel.currentPage;
	$.headingLabel.text = exhibits[index].name;
	$.exhibitInfoLabel.text = exhibits[index].long_description;
	$.exhibitInfoScrollView.animate({
		opacity : 1,
		duration : 300
	});
	$.exhibitInfoScrollView.height = Ti.UI.SIZE;
	setTimeout(function() {
		$.exhibitInfoScrollView.height = Ti.UI.SIZE;
	}, 300);

	var slideIn = Ti.UI.createAnimation({
		height : '0dip',
		duration : 300,
		curve : Titanium.UI.ANIMATION_CURVE_EASE_IN_OUT
	});
	$.collapsibleComponentView.animate(slideIn);

	$.exhibitInfoScrollView.scrollTo(0, 0);
}

function createComponentsScrollView(exhibits) {
	currExhibitId = exhibits[0].id;

	for (var i = 0; i < exhibits.length; i++) {
		componentsInExhibit[exhibits[i].id] = Ti.UI.createView({
			layout : 'horizontal',
			horizontalWrap : false,
			width : Ti.UI.SIZE,
			height : defaultComponentHeight
		});
		if (Titanium.Platform.osname == "ipad") {
			componentsInExhibit[exhibits[i].id].height = ipadComponentHeight;
		}
		for (var j = 0; j < exhibits[i].components.length; j++) {
			var component = createLabeledPicView(exhibits[i].components[j], '20dip');
			component.left = "3dip";
			component.width = '275dip';
			if (Titanium.Platform.osname == "ipad") {
				component.width = "500dip";
			}
			component.id = exhibits[i].components[j].id;
			component.addEventListener('click', (function(image) {
				return function(e) {
					return openComponent(e, image);
				};
			})(exhibits[i].components[j].image));
			componentsInExhibit[exhibits[i].id].add(component);
		}

		$.componentScrollView.add(componentsInExhibit[exhibits[i].id]);
		componentsInExhibit[exhibits[i].id].width = 0;
	}
	componentsInExhibit[currExhibitId].width = Ti.UI.SIZE;
}

function openComponent(e, componentImageUrl) {
	addSpinner();
	var components = Alloy.Collections.instance('component');
	var component = components.where({"id": e.source.itemId})[0];
	var controller = Alloy.createController('componentLanding', [component, componentImageUrl]);
	var analyticsTitle = component.getScreenName();
	var analyticsLevel = "Component Landing";
	controller.setAnalyticsPageTitle(analyticsTitle);
	controller.setAnalyticsPageLevel(analyticsLevel);
	Alloy.Globals.navController.open(controller);
	hideSpinner();
}

function createLabeledPicView(item, textSize) {
	var itemContainer = Ti.UI.createView();
	var image = Ti.UI.createImageView({
		height : '100%',
		width : '100%'
	});
	var clickCatcher = Ti.UI.createView({
		itemId : item.id
	});
	image.image = item.image;

	itemContainer.add(image);
	itemContainer.add(createTitleLabel(item.name, textSize));
	itemContainer.add(clickCatcher);
	return itemContainer;
}

function createExhibitSelect(exhibits) {
	$.exhibitSelect.addEventListener('click', function(e) {
		onExhibitsClick(exhibits);
	});
}

init();
