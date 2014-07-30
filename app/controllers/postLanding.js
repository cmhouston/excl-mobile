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
	hideAllSharingButtonsForKiosk();
};

$.onExitKioskMode = function() {
	$.navBar.onExitKioskMode();
	showAllSharingButtons();
	turnOffAppropriateSharingButtons();
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

function createPlainRowWithHeight(rowHeight) {
	var row = Ti.UI.createView({
		height : rowHeight,
		width : '100%',
		top : '15dip',
		backgroundColor : '#FFFFFF'
	});

	return row;
}

function displayThereAreNoCommentsToDisplayText() {
	$.noComments.height = Ti.UI.SIZE;
}

function addCommentToView(commentText, commentDate) {
	createCommentText(commentText);
	createCommentDate(commentDate);
}

function createCommentText(commentText) {
	var row = createPlainRowWithHeight(Ti.UI.SIZE);
	var text = labelService.createCustomLabel({text: commentText});
	$.addClass(text, "commentBody commentsInfo");
	row.add(text);
	$.commentsView.add(row);
}

function createCommentDate(commentDate) {
	var row = createPlainRowWithHeight(Ti.UI.SIZE);
	var date = labelService.createCustomLabel({text: commentDate});
	$.addClass(date, "commentDate commentsInfo");
	row.add(date);
	$.commentsView.add(row);
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
		$.showMoreComments.height = Ti.UI.SIZE;
		// if clicked, hide it and show the other comments
		$.showMoreComments.addEventListener('click', function(e) {
			for (var i = commentsLengthLimit; i < comments.length; i++) {
				addCommentToView(comments[i].body, comments[i].date);
			}
			$.tableView.remove($.showMoreComments);
		});
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
	
	if (post_content.post_body) {
		Ti.App.addEventListener('app:openInBrowser', openInBrowser);
		$.webView.setHtml(wrapRichTextInHTML(post_content.post_body));
	} else {
		$.webView.height = "0dip"
	}

	showAllSharingButtons();
	turnOffAppropriateSharingButtons();

	if (post_content.commenting) {
		$.commentsHeading.height = Ti.UI.SIZE;
		var comments = post.getAllComments();
		if (comments != false) {
			displayComments(comments);
		} else {
			displayThereAreNoCommentsToDisplayText();
		}
	}
}

function openInBrowser(e) {
	Ti.Platform.openURL(e.url);
}

function turnOffAppropriateSharingButtons() {
	if (!post_content.commenting) {
		$.resetClass($.commentingButton, "socialMediaButtonHidden");
	}
	if (!post_content.text_sharing) {
		$.resetClass($.shareTextButton, "socialMediaButtonHidden");
	}
	if (!post_content.image_sharing) {
		$.resetClass($.sharePhotoButton, "socialMediaButtonHidden");
	}
	if (!post_content.commenting && !post_content.text_sharing && !post_content.image_sharing) {
		hideAllSharingButtons();
	}
	if (Alloy.Globals.adminModeController.isInKioskMode()) {
		hideAllSharingButtonsForKiosk();
	}
}

function hideAllSharingButtons() {
	$.resetClass($.socialMediaButtonsRow, "hidden");
	$.resetClass($.commentingButton, "socialMediaButtonHidden");
	$.resetClass($.shareTextButton, "socialMediaButtonHidden");
	$.resetClass($.sharePhotoButton, "socialMediaButtonHidden");
}

function hideAllSharingButtonsForKiosk() {
	$.resetClass($.shareTextButton, "socialMediaButtonHidden");
	$.resetClass($.sharePhotoButton, "socialMediaButtonHidden");
}

function showAllSharingButtons() {
	$.resetClass($.socialMediaButtonsRow, "autoHeight");
	$.resetClass($.commentingButton, "socialMediaButtonShown");
	$.resetClass($.shareTextButton, "socialMediaButtonShown");
	$.resetClass($.sharePhotoButton, "socialMediaButtonShown");
}

function clickThankYouMessage(e) {
	$.commentsModal.visible = false;
	$.addNewCommentContainer.visible = false;
	$.scroller.scrollingEnabled = false;
	setCommentIconReady($.commentingButton);
}

function clickSubmitComment(e) {
	$.insertName.blur();
	$.insertEmail.blur();
	$.insertComment.blur();
	verifyData($.commentingButton);
}

function clickCancelComment(e) {
	setCommentIconReady($.commentingButton);
	$.insertName.blur();
	$.insertEmail.blur();
	$.insertComment.blur();
	$.addNewCommentContainer.visible = false;
	$.commentsModal.visible = false;
	$.scroller.scrollingEnabled = true;
}

function comment(e) {
	setCommentIconBusy($.commentingButton);
	$.addNewCommentContainer.visible = true;
	$.commentsModal.visible = true;
	$.submitCommentFormView.visible = true;
	$.insertName.value = $.insertEmail.value = $.insertComment.value = "";
	$.thankYouMessageView.visible = false;
	$.scroller.scrollingEnabled = false;
}

function shareText(e) {
	sharingTextService.setIconBusy($.shareTextButton);
	postTags = sharingTextService.getPostTags(post_content);
	sharingTextService.initiateIntentText(postTags, $.shareTextButton);
}

function sharePhoto(e) {
	sharingImageService.setIconBusy($.sharePhotoButton);
	postTags = sharingImageService.getPostTags(post_content);
	cameraService.takePicture(postTags, e.source, $.postLanding);
	sharingImageService.setIconReady($.sharePhotoButton);
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
		image : post_content.image,
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

function getRowContentsForImage(url) {
	imageView = Ti.UI.createImageView({ image : url });
	$.addClass(imageView, "headerImage");
	return imageView;
}

function wrapRichTextInHTML(text) {
	var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "webViewInjectableHTML.html");
	html = file.read().text.replace("${RICH_TEXT}", text);
	Ti.API.info("Replaced HTML: " + html);
	//html += "function openInBrowser(link) { Ti.App.fireEvent('app:openInBrowser', {url: link}) } function changeLinksToOpenInBrowser() { alert('working'); var aTags = document.getElementsByTagName('a'); for (var i = 0; i < aTags.length; i++) { var tag = aTags[i]; var linkURL = tag.href; tag.setAttribute('href', '#'); tag.setAttribute('onclick', 'openInBrowser(\"' + linkURL + '\"); return false;'); } }; window.onload = changeLinksToOpenInBrowser;";
	return html;
}

initializePage();
