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

var iconService = setPathForLibDirectory('customCalls/iconService');
iconService = new iconService();
var viewService = setPathForLibDirectory('customCalls/viewService');
viewService = new viewService();
var buttonService = setPathForLibDirectory('customCalls/buttonService');
buttonService = new buttonService();
var detectDevice = setPathForLibDirectory('customCalls/deviceDetectionService');
detectDevice = new detectDevice();

var loadingSpinner = setPathForLibDirectory('loadingSpinner/loadingSpinner');
var addLoadingMessage = true;
var loadingSpinnerLib = new loadingSpinner(addLoadingMessage);
var spinner = loadingSpinnerLib.getSpinner();
var loadingSpinnerView = viewService.createCustomView("");
var loadingSpinnerDarkView = viewService.createCustomView({
	backgroundColor : "#000000",
	opacity : 0.3
});
loadingSpinnerView.add(loadingSpinnerDarkView);

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
}

function addSpinner() {
	loadingSpinnerView.add(spinner);
	if (addLoadingMessage && OS_IOS){
		loadingSpinnerLib.scrambleMessage();
	}
	spinner.show();
	$.exhibitLanding.add(loadingSpinnerView);
}

function hideSpinner() {
	spinner.hide();
	$.exhibitLanding.remove(loadingSpinnerView);
}

function init() {
	addSpinner();
	$.navBar.setPageTitle(json.data.museum.exhibit_label_plural);
	initializeWithJSON(json);
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
	addFunctionalityToHeadingBar(json.data.museum.exhibits);
	
	setTimeout(function(){
		createComponentsScrollView(json.data.museum.exhibits);
	}, 500);
}

function createExhibitsCarousel(exhibits) {
	
	$.exhibitsCarousel.removeView($.placeholder);
	
	for ( i = 0; i < exhibits.length; i++) {
		exhibitText[i] = exhibits[i].long_description;
		var exhibitView;

		if (OS_IOS) {
			exhibitView = createExhibitsImageIOS(exhibits, i);
		} else if (OS_ANDROID) {
			exhibitView = createExhibitsImageAndroid(exhibits, i);
		}
		$.exhibitsCarousel.addView(exhibitView);
	}
	
	$.exhibitsCarousel.setCurrentPage(0);
	
	$.headingLabel.text = "Explore This " + json.data.museum.exhibit_label;
	$.exhibitInfoLabel.text = exhibits[0].long_description;
	
	if(OS_ANDROID){
		resizeExhibitCarouselAndroid();
	}//*/
	
	$.exhibitsCarousel.addEventListener("scrollend", function(e) {
		onExhibitsScroll(e, exhibits);
	});
}

function createExhibitsImageIOS(exhibits, index) {
	var exhibit = exhibits[index];
	var numOfExhibits = exhibits.length;
	
	var	viewConfig ={
		backgroundColor : "#253342",
		width : Ti.UI.FILL,
		image : '/images/700x400.png',
		itemId : exhibit.id
	};
	
	viewConfig.height = getExhibitImageHeight();
	
	if (exhibit.exhibit_image) {
		viewConfig.image = exhibit.exhibit_image;
	}

	var exhibitViewWithTitle = Ti.UI.createView({
		layout: "vertical",
		height: Ti.UI.SIZE,
		itemId : exhibit.id,
		width: Ti.UI.FILL
	});
	var exhibitTitleBar = createExhibitTitleLabel(exhibit.name);
	exhibitViewWithTitle.add(exhibitTitleBar);
	
	var exhibitView = Ti.UI.createImageView(viewConfig);
	
	exhibitView.addEventListener('click', function(e){		
		if(e.source.id != "rightArrow" && e.source.id != "leftArrow"){
			onExhibitsClick(exhibits);
		}
	});
	
	addPagingArrowsToView(exhibitView, index, numOfExhibits);
	exhibitViewWithTitle.add(exhibitView);
	return exhibitViewWithTitle;
}

function createExhibitsImageAndroid(exhibits, index) {
	
	var exhibit = exhibits[index];
	var numOfExhibits = exhibits.length;
	
	var	viewConfig = {
		backgroundColor : "#253342",
		width : Ti.UI.FILL,
		image : '/images/700x400.png',
		itemId : exhibit.id
	};
	var itemContainer = Ti.UI.createView({
		itemId : exhibit.id,
		layout : 'vertical',
	});
	
	var imageContainer = Ti.UI.createView();
	imageContainer.height = getExhibitImageHeight();
	
	var image = Ti.UI.createImageView(viewConfig);
	
	var clickCatcher = Ti.UI.createView({
		itemId : exhibit.id,
	});
	clickCatcher.addEventListener("click", function(e) {
		if(e.source.id != "rightArrow" && e.source.id != "leftArrow"){
			onExhibitsClick(exhibits);
		}
	});
	
	addPagingArrowsToView(clickCatcher, index, numOfExhibits);
	image.image = exhibit.exhibit_image;

	itemContainer.add(createExhibitTitleLabel(exhibit.name));
	imageContainer.add(image);
	imageContainer.add(clickCatcher);
	itemContainer.add(imageContainer);
	
	return itemContainer;
}
function addPagingArrowsToView(view, pageNum, numOfPages){
	if(pageNum != 0 && numOfPages != 1){
		var leftArrow = Ti.UI.createImageView({
			id: "leftArrow",
			left: 0,
			bottom: "15%",
			height: "15%",
			width: "15%",
			backgroundColor: "#FF6600",
			image: iconService.getImageFilename("triple_arrow_right.png")
		});
		
		leftArrow.addEventListener('click', function(e){
			$.exhibitsCarousel.scrollToView($.exhibitsCarousel.getCurrentPage() -1 );
		});
		
		view.add(leftArrow);
	}

	if(pageNum != numOfPages-1){
		
		var rightArrow = Ti.UI.createImageView({
			id: "rightArrow",
			right: 0,
			top: "15%",
			height: "15%",
			width: "15%",
			backgroundColor: "#FF6600",
			image: iconService.getImageFilename("triple_arrow_left.png")
		});
		
		rightArrow.addEventListener('click', function(e){
			$.exhibitsCarousel.scrollToView($.exhibitsCarousel.getCurrentPage() + 1 );
		});
		
		view.add(rightArrow);
	}
	
	return view;
}

function createPagingArrows(pageNum, numOfPages){
	var view = Ti.UI.createView({
		backgroundColor: "transparent",
		height: Ti.UI.FILL
	});
	
	if(pageNum != 0 && numOfPages != 1){
		var leftArrow = Ti.UI.createImageView({
			left: 0,
			bottom: "15%",
			height: "10%",
			width: "15%",
			backgroundColor: "white",
			image: iconService.getImageFilename("exhibit_next.png")
		});
		
		view.add(leftArrow);
	}

	if(pageNum != numOfPages-1){
		
		var rightArrow = Ti.UI.createImageView({
			right: 0,
			top: "10%",
			height: "20%",
			width: "15%",
			backgroundColor: "white",
			image: iconService.getImageFilename("exhibit_previous.png")
		});
		
		view.add(rightArrow);
	}
	
	return view;
}

function createExhibitTitleLabel(name) {
	var titleLabelView = Ti.UI.createView({
		top : 0,
		backgroundColor : '#000',
		height: getExhibitTitleLabelHeight()
	});
	var label = Ti.UI.createLabel({
		top : 0,
		left : "3%",
		text : name,
		color : '#FFFFFF',
		horizontalWrap : false,
		font : {

			fontSize : '24dip',
			fontWeight : 'bold'
		}
	});
	if (detectDevice.isTablet()) {
		label.font = {

			fontSize : "40dip"
		};
	}
	titleLabelView.add(label);

	return titleLabelView;
}

function getExhibitTitleLabelHeight(){
	if(detectDevice.isTablet())
	{
		return 60;
	}
	return 34;
}

function createExhibitImageViewConfig(exhibit){
	
	var imageHeight = detectDevice.getWidth() * 4 / 7;
	return {
		backgroundColor : "#253342",
		width : Ti.UI.FILL,
		height: imageHeight,
		image : '/images/700x400.png',
		itemId : exhibit.id
	};
}

function getExhibitImageHeight(){
	var aspectRatio = 4/7;
	return detectDevice.getWidth() * aspectRatio;
}

function resizeExhibitCarouselAndroid(){
	var exhibitTitleHeightInPx = detectDevice.dipToPx(getExhibitTitleLabelHeight());
	var carouselHeight = getExhibitImageHeight() + exhibitTitleHeightInPx;
	$.exhibitsCarousel.height = carouselHeight;
}

function createComponentTitleLabel(name) {
	var titleLabelView = Ti.UI.createView({
		top : 0,
		backgroundColor : '#000',
		height: getComponentTitleLabelHeight()
	});
	var label = Ti.UI.createLabel({
		top : 0,
		left : "3%",
		text : name,
		color : '#FFFFFF',
		horizontalWrap : false,
		font : {

			fontSize : '20dip',
			fontWeight : 'bold'
		}
	});
	if (detectDevice.isTablet()) {
		label.font = {

			fontSize : "27dip"
		};
	}
	titleLabelView.add(label);

	return titleLabelView;
}

function getComponentTitleLabelHeight(){
	return "27dip";
}

function addFunctionalityToHeadingBar(exhibits){
	$.headingLabelView.addEventListener("click", function(e) {
		onExhibitsClick(exhibits);
	});
	
	$.arrowIcon.image = iconService.getImageFilename("arrow3.png");		// TODO decide on Arrow
}

function onExhibitsClick(exhibits) {
	$.exhibitInfoScrollView.scrollTo(0, 0);
	if (!isBottomViewShowing()) {
		var pageIndex = $.exhibitsCarousel.currentPage;
		$.exhibitInfoLabel.text = exhibits[pageIndex].long_description;
		animateTopViewDown();

	} else {
		$.headingLabel.text = "Explore This " + json.data.museum.exhibit_label;
		animateTopViewUp();
	}
}

function animateTopViewDown(){
	var headingLabelHeight = makeDefaultUnitsFromDip($.headingLabelView.height);
	var topMeasurement = $.infoView.toImage().height - headingLabelHeight;
	
	var animationDuration = 300;
	
	$.arrowIcon.animate({
		transform: Ti.UI.create2DMatrix().rotate(180),
		duration: animationDuration
	});
	
	$.topView.animate({
		top: topMeasurement,
		duration: animationDuration
	});	

	setTimeout(function(e){
		$.topView.top = topMeasurement;
		$.headingLabel.text = "Go Back";
	}, animationDuration);
	
}

function animateTopViewUp(){
	var animationDuration = 300;
	
	$.arrowIcon.animate({
		transform: Ti.UI.create2DMatrix().rotate(0),
		duration: animationDuration
	});
	
	$.topView.animate({
		top: 0,
		duration: animationDuration
	});
	
	setTimeout(function(e){
		$.topView.top = 0;
	}, animationDuration);
}

function isBottomViewShowing(){
	if (stripUnitsOffMeasurement($.topView.top) == 0 ){
		return false;
	}
	else{
		return true;
	}
}

function makeDefaultUnitsFromDip(str){
	//Strip units
	num = stripUnitsOffMeasurement(str);
	//Convert to px if necessary
	if (OS_ANDROID){
		num= detectDevice.dipToPx(num);
	}
	return num;
}

function stripUnitsOffMeasurement(str){
	return parseInt(str);
}

function onExhibitsScroll(e, exhibits) {
	var index = $.exhibitsCarousel.currentPage;
	$.headingLabel.text = "Explore This " + json.data.museum.exhibit_label;
	$.exhibitInfoLabel.text = exhibits[index].long_description;
	
	animateTopViewUp();
	setTimeout(function(){
		changeVisibleComponents(e);
	}, 300);
	
	$.exhibitInfoScrollView.scrollTo(0, 0);
}

function changeVisibleComponents(e){
	componentsInExhibit[currExhibitId].width = 0;
	componentsInExhibit[e.view.itemId].width = Ti.UI.SIZE;
	currExhibitId = e.view.itemId;
}

function createComponentsScrollView(exhibits) {
	currExhibitId = exhibits[0].id;

	for (var i = 0; i < exhibits.length; i++) {
		
		componentsInExhibit[exhibits[i].id] = Ti.UI.createView({
			layout : 'horizontal',
			horizontalWrap : false,
			height: Ti.UI.SIZE,
		});
		
		for (var j = 0; j < exhibits[i].components.length; j++) {
			var component = createLabeledPicView(exhibits[i].components[j]);
			component.left = "3dip";
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

function getComponentImageHeight(){
	//Fits height to available space on screen
	var headingLabelViewHeight = stripUnitsOffMeasurement($.headingLabelView.height);
	var componentScrollViewHeadingHeight = stripUnitsOffMeasurement($.componentScrollViewHeading.height);
	var componentTitleLabelHeight = stripUnitsOffMeasurement(getComponentTitleLabelHeight());
	var infoViewHeight = $.infoView.toImage().height;
	Ti.API.info("headingLabelViewHeight: " + headingLabelViewHeight + " componentScrollViewHeadingHeight: " + componentScrollViewHeadingHeight + " infoViewHeight: " + infoViewHeight);
	
	if(OS_ANDROID){
		headingLabelViewHeight = detectDevice.dipToPx(headingLabelViewHeight);
		componentScrollViewHeadingHeight = detectDevice.dipToPx(componentScrollViewHeadingHeight);
		componentTitleLabelHeight = detectDevice.dipToPx(componentTitleLabelHeight);
	}
	
	return (infoViewHeight - headingLabelViewHeight - componentScrollViewHeadingHeight - componentTitleLabelHeight - 6);
}

function getComponentImageWidth(height){
	//Fits width based on component image height and desired aspect ratio
	var width = height*7.0/4;
	return width;
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

function createLabeledPicView(item) {
	
	var imageHeight =  getComponentImageHeight();
	
	var itemContainer = Ti.UI.createView({
		layout: "vertical",	
		height : Ti.UI.SIZE,
		width : getComponentImageWidth(imageHeight),
	});
	
	var image = Ti.UI.createImageView({
		height : imageHeight,
		width : getComponentImageWidth(imageHeight),
		itemId: item.id
	});
	
	image.image = item.image;

	itemContainer.add(createComponentTitleLabel(item.name));
	itemContainer.add(image);
	
	return itemContainer;
}


init();
