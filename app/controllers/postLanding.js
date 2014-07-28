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

var post = arguments[0] || {};
var post_content = post.get('rawJson');

var tableData = [];
var dataRetriever = setPathForLibDirectory('dataRetriever/dataRetriever');
var buttonService = setPathForLibDirectory("customCalls/buttonService");
buttonService = new buttonService();
var labelService = setPathForLibDirectory("customCalls/labelService");
labelService = new labelService();
sharingTextService = setPathForLibDirectory('sharing/sharingTextService');
var sharingTextService = new sharingTextService();
sharingImageService = setPathForLibDirectory('sharing/sharingImageService');
var sharingImageService = new sharingImageService();

var detectDevice = setPathForLibDirectory('customCalls/deviceDetectionService');
detectDevice = new detectDevice();
var loadingSpinner = setPathForLibDirectory('loadingSpinner/loadingSpinner');
var spinnerLib = new loadingSpinner();
var spinner = spinnerLib.getSpinner();
var loadingSpinnerView = Ti.UI.createView();

var imageFilePathAndroid = "/images/icons_android/";
var imageFilePathIOS = "/images/icons_ios/";

/**
 * Analytics specific information
 */
var analyticsPageTitle = "Post Landing";
var analyticsPageLevel = "Post Landing";

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
//----------------------------------------------------

function setPathForLibDirectory(libFile) {
	if ( typeof Titanium == 'undefined') {
		lib = require("../../lib/" + libFile);
	} else {
		lib = require(libFile);
	}
	return lib;
}

$.onEnterKioskMode = function() {
	$.navBar.onEnterKioskMode();
};

$.onExitKioskMode = function() {
	$.navBar.onExitKioskMode();
};

function setPageTitle(name) {
	if (name === "") {
		$.navBar.setPageTitle("[Title]");
	} else {
		$.navBar.setPageTitle(name);
	}
}

function hideMenuBtnIfKioskMode(){
	if (Alloy.Globals.adminModeController.isInKioskMode()){
		$.navBar.hideMenuBtn();
	}
}

function addCommentingButton(json, row, iconList, objectArgs) {
	if (json.commenting) {
		var commentButton = buttonService.createCustomButton(objectArgs);
		setCommentIconReady(commentButton);
		commentButton.addEventListener('click', function(e) {
			setCommentIconBusy(commentButton);
			$.addNewCommentContainer.visible = ($.addNewCommentContainer.visible) ? false : true;
			$.whiteCommentBox.visible = ($.whiteCommentBox.visible) ? false : true;
			$.submitCommentFormView.visible = true;
			$.insertName.value = $.insertEmail.value = $.insertComment.value = "";
			$.thankYouMessageView.visible = false;
			$.scroller.scrollTo(0, 0);
			$.scroller.scrollingEnabled = false;
			$.submitYourCommentLabel.text = "Submit Your Comment";
			formatCommentBoxForIpad();
		});

		$.thankYouMessageView.addEventListener('click', function(e) {
			$.whiteCommentBox.visible = false;
			$.addNewCommentContainer.visible = false;
			$.scroller.scrollingEnabled = false;
			setCommentIconReady(commentButton);
		});

		$.cancelCommentButton.addEventListener('click', function(e) {
			setCommentIconReady(commentButton);
			$.insertName.blur();
			$.insertEmail.blur();
			$.insertComment.blur();
			$.addNewCommentContainer.visible = ($.addNewCommentContainer.visible) ? false : true;
			$.whiteCommentBox.visible = ($.whiteCommentBox.visible) ? false : true;
			$.scroller.scrollTo(0, 0);
			$.scroller.scrollingEnabled = true;
		});

		$.submitButton.addEventListener('click', function(e) {
			verifyData(commentButton);
			$.scroller.scrollTo(0, 0);
		});
		iconList.push(commentButton);
		row.add(commentButton);
	}
}

function addTextSharingButton(json, row, iconList, objectArgs) {
	if (json.text_sharing && !Alloy.Globals.adminModeController.isInKioskMode()) {
		var shareTextButton = sharingTextService.initiateTextShareButton(json, objectArgs);
		iconList.push(shareTextButton);
		row.add(shareTextButton);
	}
}

function addImageSharingButton(json, row, iconList, objectArgs) {
	if (json.image_sharing && !Alloy.Globals.adminModeController.isInKioskMode()) {
		var shareImageButton = sharingImageService.initiateImageShareButton(json, objectArgs, $.postLanding);
		iconList.push(shareImageButton);
		row.add(shareImageButton);
	}
}

function spaceIconsAccordingToNumberAdded(iconList) {
	var listLength = iconList.length;
	var maxLeftSpacingAsPercent = 90;
	var distanceBetweenIcons = maxLeftSpacingAsPercent / (listLength + 1);

	for (var i = 0; i < listLength; i++) {
		iconList[i].left = distanceBetweenIcons * (i + 1) + "%";
	}
}

function setCommentIconReady(button) {
	buttonIcon = "comment_ready.png";
	if (OS_IOS) {
		button.backgroundImage = imageFilePathIOS + buttonIcon;
	} else if (OS_ANDROID) {
		button.backgroundImage = imageFilePathAndroid + buttonIcon;
	}
}

function setCommentIconBusy(button) {
	buttonIcon = "comment_busy.png";
	if (OS_IOS) {
		button.backgroundImage = imageFilePathIOS + buttonIcon;
	} else if (OS_ANDROID) {
		button.backgroundImage = imageFilePathAndroid + buttonIcon;
	}
}

function creatingCommentTextHeading() {
	var row = createPlainRowWithHeight('10%');
	if (OS_IOS) {
		row.bottom = "48dip";
		row.height = "10%";
	} else {
		row.height = "50dip";
	}
	var objectArgs = {
		top : "20dip",
		width : '94%',
		right : '3%',
		left : '3%',
		color : '#232226',
		font : {
			
			fontSize : '16dip',
			fontWeight : 'bold',
		},
		text : "Add Comment",
		textAlign : 'center',
		borderWidth : '1',
		borderColor : '#aaa'
	};
	var commentHeading = labelService.createCustomLabel(objectArgs);
	if (detectDevice.isTablet()) {
		commentHeading.font = {
			
			fontSize : "30dip"
		};
	}
	row.addEventListener('click', function(e) {
		$.addNewCommentContainer.visible = ($.addNewCommentContainer.visible) ? false : true;
		$.whiteCommentBox.visible = ($.whiteCommentBox.visible) ? false : true;
		$.submitCommentFormView.visible = true;
		$.insertName.value = $.insertEmail.value = $.insertComment.value = "";
		$.thankYouMessageView.visible = false;
		$.scroller.scrollTo(0, 0);
		$.scroller.scrollingEnabled = false;
	});
	row.add(commentHeading);
	tableData.push(row);
}

function displayThereAreNoCommentsToDisplayText() {
	var row = createPlainRowWithHeight(Ti.UI.SIZE);
	var objectArgs = {
		top : "10dip",
		width : '94%',
		right : '3%',
		left : '3%',
		color : '#48464e',
		font : {
			fontSize : '13dip',
			fontWeight : 'normal',
		},
		text : "There are no comments for this post"
	};
	var noCommentText = labelService.createCustomLabel(objectArgs);
	if (detectDevice.isTablet()) {
		noCommentText.font = {
			
			fontSize : "25dip"
		};
	}
	row.add(noCommentText);
	tableData.push(row);
}

function addCommentToView(commentText, commentDate) {
	createCommentText(commentText);
	createCommentDate(commentDate);
	fixPageSpacing();
}

function createCommentText(commentText) {
	var row = createPlainRowWithHeight(Ti.UI.SIZE);
	if (OS_ANDROID) {
		row.top = "10%";
	}
	var objectArgs = {
		top : "10dip",
		width : '94%',
		right : '3%',
		left : '3%',
		color : '#232226',
		font : {
			
			fontSize : '13dip',
			fontWeight : 'normal',
		},
		text : commentText
	};
	var text = labelService.createCustomLabel(objectArgs);
	if (detectDevice.isTablet()) {
		text.font = {
			
			fontSize : "25dip"
		};
	}
	row.add(text);
	tableData.push(row);
}

function createCommentDate(commentDate) {
	var row = createPlainRowWithHeight(Ti.UI.SIZE);
	var objectArgs = {
		width : '94%',
		right : '3%',
		left : '3%',
		color : '#48464e',
		font : {
			
			fontSize : '8dip',
			fontWeight : 'normal',
		},
		text : commentDate
	};
	var date = labelService.createCustomLabel(objectArgs);
	if (detectDevice.isTablet()) {
		date.font = {
			
			fontSize : "17dip"
		};
	}
	row.add(date);
	tableData.push(row);
}

function displayComments(comments) {
	// display the top 2 comments first and rest of them,
	// should be hidden with the 'see more comments' text
	// once that text is clicked it should load all the comments

	var commentsLengthLimit = 2;
	var commentsLength = (comments.length > commentsLengthLimit) ? commentsLengthLimit : comments.length;
	for (var i = 0; i < commentsLength; i++) {
		addCommentToView(comments[i].body, comments[i].date);
	}

	if (comments.length > commentsLengthLimit) {
		var row = createPlainRowWithHeight(Ti.UI.FILL);
		var objectArgs = {
			top : "10dip",
			width : '94%',
			right : '3%',
			left : '3%',
			color : '#005ab3',
			font : {
				
				fontSize : '13dip',
				fontWeight : 'normal',
			},
			text : "Show more comments",
			textAlign : 'center'
		};
		var text = labelService.createCustomLabel(objectArgs);
		if (detectDevice.isTablet()) {
			text.font = {
				
				fontSize : "20dip"
			};
		}
		row.add(text);

		// if clicked, hide it and show the other comments
		row.addEventListener('click', function(e) {
			tableData.pop();
			// remove the last element, which is the "show more comments" row in this case
			for (var i = commentsLengthLimit; i < comments.length; i++) {
				addCommentToView(comments[i].body, comments[i].date);
			}
			addTableDataToTheView(tableData);
		});

		tableData.push(row);

	}
}

function verifyData(commentButton) {
	var errorMessage = "We found an error in your: ";
	var errorMessageParts = [];
	var errorDetected = false;

	if (!validateName($.insertName.value)) {
		errorDetected = true;
		errorMessageParts.push("Name");
	}

	if (!validateEmail($.insertEmail.value)) {
		errorDetected = true;
		errorMessageParts.push("Email");
	}

	if (!validateComment($.insertComment.value)) {
		errorDetected = true;
		errorMessageParts.push("Comment");
	}

	errorMessage = compileErrorMessage(errorMessage, errorMessageParts);

	if (errorDetected) {
		alert(errorMessage);
	} else {
		sendComment(commentButton);
	}
}

function validateName(name) {
	if (name) {
		for (var i = 0; i < name.length; i++) {
			if (!Alloy.Globals.isAlpha(name[i])) {
				return false;
			}
		}
	}
	return true;
}

function validateEmail(email) {
	if (email) {
		var emailFormat = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return emailFormat.test(email);
	}
	return true;
}

function validateComment(comment) {
	if (!comment) {
		return false;
	} else {
		return true;
	}
}

function compileErrorMessage(errorMessage, errorMessageParts) {
	for (var i = 0; i < errorMessageParts.length; i++) {
		if (i == 0) {
			errorMessage += errorMessageParts[i];
		} else if (i == errorMessageParts.length - 1 && errorMessageParts.length != 1) {
			if (errorMessageParts.length == 2) {
				errorMessage += (" and " + errorMessageParts[i]);
			} else {
				errorMessage += (", and " + errorMessageParts[i]);
			}
		} else {
			errorMessage += (", " + errorMessageParts[i]);
		}
	}
	return errorMessage;
}

function addSpinner() {
	spinnerLib.makeDark();
	spinnerLib.setTop("50%");
	loadingSpinnerView.add(spinner);
	spinner.show();
	$.postLanding.add(loadingSpinnerView);
}

function hideSpinner() {
	spinner.hide();
	$.postLanding.remove(loadingSpinnerView);
}

function sendComment(commentButton) {
	addSpinner();
	var url = Alloy.Globals.rootWebServiceUrl + "/posts/" + post_content.id + "/comments";
	var jsonToSend = ( {
		"name" : $.insertName.value,
		"email" : $.insertEmail.value,
		"comment_body" : $.insertComment.value
	});
	dataRetriever.sendJsonToUrl(url, jsonToSend, function(returnedData) {
		setCommentSubmittedMessage();
		hideSpinner();
	});
	setCommentIconReady(commentButton);

}

function setCommentSubmittedMessage() {
	$.submitCommentFormView.visible = false;
	$.thankYouMessageView.visible = true;
	$.submitYourCommentLabel.text = "Comment Submitted";
	$.thankYouMessageComment.text = "Thank you.\nYour comment has been submitted and will be visible upon approval.\n\n\nClick the box to close it.";
}

function initializePage() {
	setPageTitle(post_content.name);
	hideMenuBtnIfKioskMode();

	switch (post_content.post_header_type) {
		case "image":
			$.headerRow.add(getRowContentsForImage(post_content.post_header_url));
			break;
		case "video":
			$.headerRow.add(getRowContentsForVideo(post_content.post_header_url));
			break;
		default:
			break;
	}
	
	displaySocialMediaButtonsInRow(post_content, $.socialMediaButtonsRow);
	
	if (post_content.post_body) {
		$.postBodyRow.add(getRowContentsForRichText(post_content.post_body));
	}
	

	//if (post_content.commenting) {
	//	creatingCommentTextHeading();
	//	var comments = post.getAllComments();
	//	if (comments != false) {
	//		displayComments(comments);
	//	} else {
	//		displayThereAreNoCommentsToDisplayText();
	//	}
	//}

	//formatCommentBoxForIpad(); 

}

function getRowContentsForVideo(url) {
	if (OS_ANDROID) {
		return getRowContentsForVideoAndroid(url);
	}
	if (OS_IOS) {
		return getRowContentsForVideoiOS(url);
	}
}

function getRowContentsForVideoAndroid(url) {
	var thumbnailView = Ti.UI.createView({	});
	var thumbnailImageView = Ti.UI.createImageView({
		//image : part.get('thumbnail'),
		width : '100%',
		height : '100%'
	});
	var playTriangle = Ti.UI.createImageView({
		image : "/images/icons_android/Video-Player-icon-simple.png",
	});
	thumbnailView.add(thumbnailImageView);
	thumbnailView.add(playTriangle);
	//Add event listener- when thumbnail is clicked, open fullscreen video
	thumbnailView.addEventListener('click', function(e) {
		var video = Titanium.Media.createVideoPlayer({
			url : url,
			fullscreen : true,
			autoplay : true
		});
		
		video.addEventListener('load', function(e) {
			//Alloy.Globals.analyticsController.trackEvent("Videos", "Play", part.get('name'), 1);
		});

		doneButton = Ti.UI.createButton({
			title : "Done",
			top : "0dip",
			height : "40dip",
			left : "10dip",
		});

		doneButton.addEventListener('click', function(e) {
			video.hide();
			video.release();
			video = null;
		});
		video.add(doneButton);

	});
	return thumbnailView;
}

function getRowContentsForVideoiOS(url) {
	var video = Titanium.Media.createVideoPlayer({
		url : url,
		fullscreen : false,
		autoplay : false,
	});
	video.addEventListener('load', function(e) {
		//Alloy.Globals.analyticsController.trackEvent("Videos", "Play", part.get('name'), 1);
	});
	return video;
}

function displaySocialMediaButtonsInRow(json, row) {
	var iconList = [];
	var objectArgs = {
		height : "30dip",
		width : "30dip",
		top : "2%"
	};
	if (detectDevice.isTablet()) {
		objectArgs["height"] = "40dip";
		objectArgs["width"] = "40dip";
	}
	//addCommentingButton(json, row, iconList, objectArgs);
	addTextSharingButton(json, row, iconList, objectArgs);
	addImageSharingButton(json, row, iconList, objectArgs);
	spaceIconsAccordingToNumberAdded(iconList);
	return row;
}

function getRowContentsForImage(url) {
	imageView = Ti.UI.createImageView({ image : url });
	$.addClass(imageView, "headerImage");
	return imageView;
}

function getRowContentsForRichText(text) {
	var webView = Ti.UI.createWebView({ html : text	});
	$.addClass(webView, "postWebView");
	return webView;
}

function formatCommentBoxForIpad() {
	if (detectDevice.isTablet()) {
		$.whiteCommentBox.height = "700dip";
		$.whiteCommentBox.width = "500dip";
		$.buttonView.height = "75dip";
		$.insertNameDisclaimer.font = {
			fontSize : "15dip"
		};
		$.insertEmailDisclaimer.font = {
			fontSize : "15dip"
		};
		$.insertName.height = "50dip";
		$.insertEmail.height = "50dip";
		$.insertComment.height = "300dip";
		$.cancelCommentButton.font = {
			fontSize : '25dip',
			fontWeight : 'bold'
		};
		$.submitButton.font = {
			fontSize : '25dip',
			fontWeight : 'bold'
		};
	}
}

initializePage();
