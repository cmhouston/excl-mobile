var post = arguments[0] || {};
var post_content = post.get('rawJson');

var tableData = [];
var dataRetriever = setPathForLibDirectory('dataRetriever/dataRetriever');
var buttonService = setPathForLibDirectory("customCalls/buttonService");
buttonService = new buttonService();
var labelService = setPathForLibDirectory("customCalls/labelService");
labelService = new labelService();
sharingTextService = Alloy.Globals.setPathForLibDirectory('sharing/sharingTextService');
var sharingTextService = new sharingTextService();
sharingImageService = Alloy.Globals.setPathForLibDirectory('sharing/sharingImageService');
var sharingImageService = new sharingImageService();
var loadingSpinner = Alloy.Globals.setPathForLibDirectory('loadingSpinner/loadingSpinner');
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

/**
 * Controller Functions
 */
function createPlainRowWithHeight(rowHeight) {
	var row = Ti.UI.createTableViewRow({
		height : rowHeight,
		width : '100%',
		top : '15dip',
		backgroundColor : '#FFFFFF'
	});

	return row;
}

function fixPageSpacing() {
	if (OS_IOS) {
		$.tableView.bottom = "48dip";
	}
}

function setPageTitle(name) {
	if (name === "") {
		$.navBar.setPageTitle("[Title]");
	} else {
		$.navBar.setPageTitle(name);
	}
}

/*
 * Adds sharing buttons
 */
function displaySocialMediaButtons(json) {
	//Create anchor for instagram viewer
	var row = createPlainRowWithHeight('auto');
	var iconList = [];
	var objectArgs = {
		height : "40dip",
		width : "40dip",
		top : "2%"
	};
	addCommentingButton(json, row, iconList, objectArgs);
	addTextSharingButton(json, row, iconList, objectArgs);
	addImageSharingButton(json, row, iconList, objectArgs);
	spaceIconsAccordingToNumberAdded(iconList);
	return row;
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

	Ti.API.info("between: " + distanceBetweenIcons);

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

function getImageRowFromPart(part) {
	var row = createPlainRowWithHeight('200dip');
	if (Titanium.Platform.osname == "ipad") {
		row.height = "40%";
	}
	imageView = Ti.UI.createImageView({
		image : part.get('image'),
		width : "90%",
		height : Ti.UI.SIZE
	});

	row.add(imageView);
	return row;

}

function getVideoRowFromPart(part) {
	if (OS_ANDROID) {
		return getVideoRowFromPartAndroid(part);
	}
	if (OS_IOS) {
		return getVideoRowFromPartiOS(part);
	}
}

function getVideoRowFromPartAndroid(part) {
	var row = createPlainRowWithHeight('200dip');
	row.add(getVideoThumbnailViewFromPartAndroid(part));
	return row;
}

function getVideoThumbnailViewFromPartAndroid(part) {
	var thumbnailView = Ti.UI.createView({	});
	var thumbnailImageView = Ti.UI.createImageView({
		image : part.get('thumbnail'),
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
			url : part.get('video'),
			fullscreen : true,
			autoplay : true
		});
		video.addEventListener('load', function(e) {
			Alloy.Globals.analyticsController.trackEvent("Videos", "Play", part.get('name'), 1);
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

function getVideoRowFromPartiOS(part) {
	var row = createPlainRowWithHeight('200dip');
	if (Titanium.Platform.osname == "ipad") {
		row.height = "40%";
	}
	var video = Titanium.Media.createVideoPlayer({
		url : part.get('video'),
		fullscreen : false,
		autoplay : false,
	});
	video.addEventListener('load', function(e) {
		Alloy.Globals.analyticsController.trackEvent("Videos", "Play", part.get('name'), 1);
	});
	row.add(video);
	return row;
}

function getTextRowFromPart(part) {
	var row = createPlainRowWithHeight('auto');
	var objectArgs = {
		width : '94%',
		right : '3%',
		left : '3%',
		color : '#232226',
		font : {
			fontFamily : 'Helvetica Neue',
			fontSize : '13dp',
			fontWeight : 'normal',
		},
		text : part.get('body'),
	};
	var textBody = labelService.createCustomLabel(objectArgs);
	if (Titanium.Platform.osname == "ipad") {
		textBody.font = {
			fontSize : "25dip"
		};
	}
	row.add(textBody);
	return row;
}

function getRichTextRowFromPart(part) {
	var row = createPlainRowWithHeight('auto');
	var richText = part.get("rich");
	if (richText) {
		var webView = Ti.UI.createWebView({
			html : part.get('rich'),
			width : "100%",
			showScrollbars : false,
			disableBounce : true,
			height : Ti.UI.SIZE
		});
		row.add(webView);
	}
	return row;
}

function addTableDataToTheView(tableData) {
	$.tableView.height = 'auto';
	if (OS_IOS) {
		//Accounts for bounce buffer
		$.tableView.bottom = "48dip";
	}
	$.tableView.bottom = "10dip";
	// some extra margin after comments are displayed
	$.tableView.data = tableData;
	fixPageSpacing();
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
			fontFamily : 'Helvetica Neue',
			fontSize : '16dp',
			fontWeight : 'bold',
		},
		text : "Add Comment",
		textAlign : 'center',
		borderWidth : '1',
		borderColor : '#aaa'
	};
	var commentHeading = labelService.createCustomLabel(objectArgs);
	if (Titanium.Platform.osname == "ipad") {
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
	var row = createPlainRowWithHeight('auto');
	var objectArgs = {
		top : "10dip",
		width : '94%',
		right : '3%',
		left : '3%',
		color : '#48464e',
		font : {
			fontFamily : 'Helvetica Neue',
			fontSize : '13dp',
			fontWeight : 'normal',
		},
		text : "There are no comments for this post"
	};
	var noCommentText = labelService.createCustomLabel(objectArgs);
	if (Titanium.Platform.osname == "ipad") {
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
	var row = createPlainRowWithHeight('auto');
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
			fontFamily : 'Helvetica Neue',
			fontSize : '13dp',
			fontWeight : 'normal',
		},
		text : commentText
	};
	var text = labelService.createCustomLabel(objectArgs);
	if (Titanium.Platform.osname == "ipad") {
		text.font = {
			fontSize : "25dip"
		};
	}
	row.add(text);
	tableData.push(row);
}

function createCommentDate(commentDate) {
	var row = createPlainRowWithHeight('auto');
	var objectArgs = {
		width : '94%',
		right : '3%',
		left : '3%',
		color : '#48464e',
		font : {
			fontFamily : 'Helvetica Neue',
			fontSize : '8dp',
			fontWeight : 'normal',
		},
		text : commentDate
	};
	var date = labelService.createCustomLabel(objectArgs);
	if (Titanium.Platform.osname == "ipad") {
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
		var row = createPlainRowWithHeight('auto');
		var objectArgs = {
			top : "10dip",
			width : '94%',
			right : '3%',
			left : '3%',
			color : '#005ab3',
			font : {
				fontFamily : 'Helvetica Neue',
				fontSize : '13dp',
				fontWeight : 'normal',
			},
			text : "Show more comments",
			textAlign : 'center'
		};
		var text = labelService.createCustomLabel(objectArgs);
		if (Titanium.Platform.osname == "ipad") {
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
		if (Titanium.Platform.osname == "ipad") {
			$.whiteCommentBox.height = "50%";
			$.whiteCommentBox.width = "50%";
		}
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
	if (post_content.parts) {
		// var tableData = [];

		for (var i = 0; i < post_content.parts.length; i++) {
			var part = Alloy.createModel('part', post_content.parts[i]);
			part.set({
				'thumbnail' : post_content.image
			});
			tableData.push(getRowFromPart(part));
			if (i === 0) {
				tableData.push(displaySocialMediaButtons(post_content));
			}
		}
	}

	creatingCommentTextHeading();
	var comments = post.getAllComments();
	if (comments != false) {
		displayComments(comments);
	} else {
		displayThereAreNoCommentsToDisplayText();
	}
	addTableDataToTheView(tableData);
	formatCommentBoxForIpad();
	fixPageSpacing();
}

function formatCommentBoxForIpad() {
	if (Titanium.Platform.osname == "ipad") {
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
			fontFamily : 'Helvetica Neue',
			fontSize : '25dp',
			fontWeight : 'bold'
		};
		$.submitButton.font = {
			fontFamily : 'Helvetica Neue',
			fontSize : '25dp',
			fontWeight : 'bold'
		};
	}
}

function getRowFromPart(part) {
	switch (part.get('type')) {
	case 'image':
		return getImageRowFromPart(part);
		break;
	case 'text':
		return getTextRowFromPart(part);
		break;
	case 'video':
		return getVideoRowFromPart(part);
		break;
	case 'rich':
		return getRichTextRowFromPart(part);
		break;
	default:
		return null;
		break;
	}
}

initializePage();
