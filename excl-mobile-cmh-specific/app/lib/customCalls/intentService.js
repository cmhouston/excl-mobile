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

function intentService(){};
//Handles all interaction between the app and other apps on the device

// icons to remove from iOS sharing options view
var removeIcons = 'print,copy,contact,camera';

intentService.prototype.sendIntentTextAndroid = function(postTags){
	var intentText = Ti.Android.createIntent({
		action : Ti.Android.ACTION_SEND,
		type : 'text/plain'
	});
	intentText.putExtra(Ti.Android.EXTRA_TEXT, postTags);
	intentText.addCategory(Ti.Android.CATEGORY_DEFAULT);
	Ti.Android.currentActivity.startActivity(Ti.Android.createIntentChooser(intentText, "Send message via"));
};

intentService.prototype.sendIntentTextiOS = function(postTags, anchor){
	//Use TiSocial.Framework module to share text
	var Social = require('dk.napp.social');
	
	if (Social.isActivityViewSupported()) {
		if(Ti.Platform.osname == 'ipad') {
			//Social.activityView({
			//	text: postTags,
			//	removeIcons: removeIcons
			Social.activityPopover({
				text : postTags,
				view: anchor,
				removeIcons: removeIcons
			});
		}
		else {
			Social.activityView({
				text: postTags,
				removeIcons: removeIcons
			});
		}
	} else {
		alert("Text sharing is not available on this device"); //For some very old versions of iOS
	}
	
	
};

intentService.prototype.sendIntentImageAndroid = function(postTags, imageFilePath){
	var intentImage = Ti.Android.createIntent({
		type : "image/*",
		action : Ti.Android.ACTION_SEND
	});
	intentImage.addCategory(Ti.Android.CATEGORY_DEFAULT);
	intentImage.putExtra(Ti.Android.EXTRA_TEXT, postTags);
	intentImage.putExtraUri(Ti.Android.EXTRA_STREAM, imageFilePath);
	Ti.Android.currentActivity.startActivity(Ti.Android.createIntentChooser(intentImage, "Share photo via"));
};

intentService.prototype.sendIntentImageiOS = function(postTags, imageFilePath, instagramAnchor){
	//Use TiSocial.Framework module to send image to other apps
	var Social = require('dk.napp.social');
	if (Social.isActivityViewSupported()) {
		if(Ti.Platform.osname == 'ipad') {
			Social.activityPopover({
				image : imageFilePath,
				text : postTags,
				view: instagramAnchor,
				removeIcons: removeIcons
			});
		}
		else {
			Social.activityView({
				image : imageFilePath,
				text : postTags,
				removeIcons: removeIcons
			});
		}
	} else {
		alert("Photo sharing is not available on this device");
	}
};

module.exports = intentService;