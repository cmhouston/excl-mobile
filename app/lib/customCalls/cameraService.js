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

function setPathForLibDirectory(libFile) {
	if ( typeof Titanium == 'undefined') {
		lib = require("../../lib/" + libFile);
	} else {
		lib = require(libFile);
	}
	return lib;
};

function cameraService() {
	intentService = setPathForLibDirectory('customCalls/intentService');
	intentService = new intentService();
	loadingSpinner = setPathForLibDirectory('loadingSpinner/loadingSpinner');
	this.spinner = new loadingSpinner();
};

cameraService.prototype.takePicture = function(postTags, shareImageButton, instagramAnchor) {
	var imageFilePath;
	var dialog = Titanium.UI.createOptionDialog({
		title : 'Choose an image source...',
		options : ['Camera', 'Photo Gallery', 'Cancel'],
		cancel : 2
	});
	var self = this;
	dialog.addEventListener("click", function(e) {
		if (OS_IOS) {
			var selectedIndex = e.index;
		} else if (OS_ANDROID) {
			var selectedIndex = dialog.selectedIndex;
		}
		if (selectedIndex == 0) {
			Titanium.Media.showCamera({
				saveToPhotoGallery : true,
				allowImageEditing : true,
				saveToPhotoGallery : true,
				mediaTypes : Titanium.Media.MEDIA_TYPE_PHOTO,
				success : function(event) {
					self.spinner.addTo(instagramAnchor);
					self.spinner.show();
					var fileName = 'excl' + new Date().getTime() + '.jpg';
					var imageFile = Ti.Filesystem.getFile('file:///sdcard/').exists() ? Ti.Filesystem.getFile('file:///sdcard/', fileName) : Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, fileName);
					imageFile.write(event.media);
					if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
						imageFilePath = imageFile.nativePath;
						if (OS_ANDROID) {
							intentService.sendIntentImageAndroid(postTags, imageFilePath);
						} else if (OS_IOS) {
							fileNameInstagram = "excl" + new Date().getTime() + "_temp.ig";
							imageFileInstagram = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory, fileNameInstagram);
							imageFileInstagram.write(event.media);
							intentService.sendIntentImageiOS(postTags, imageFilePath, imageFileInstagram.getNativePath(), instagramAnchor);
						}
					}
					self.spinner.hide();
				},
				cancel : function() {
				},
				error : function(Error) {
					var errorMessage = Titanium.UI.createAlertDialog({
						title : 'Camera'
					});
					if (error.code == Titanium.Media.NO_CAMERA) {
						errorMessage.setMessage('Device does not have camera');
					} else {
						errorMessage.setMessage('Unexpected error: ' + error.code);
					}
					errorMessage.show();
				}
			});
		}
		
		if (selectedIndex == 1) {
			Titanium.Media.openPhotoGallery({
				success : function(event) {
					var imageFile = event.media;
					if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
						Ti.App.Properties.setString("image", imageFile.nativePath);
						imageFilePath = imageFile.nativePath;
						if (OS_ANDROID) {
							loadingSpinner.hide();
							intentService.sendIntentImageAndroid(postTags, imageFilePath);
						} else if (OS_IOS) {
							fileNameInstagram = "_temp.ig";
							imageFileInstagram = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory, fileNameInstagram);
							imageFileInstagram.write(event.media);
							intentService.sendIntentImageiOS(postTags, imageFilePath, imageFileInstagram.getNativePath(), instagramAnchor);
						}
					}
				},
				cancel : function() {
				},
				error : function() {
					var errorMessage = Titanium.UI.createAlertDialog({
						title : 'Photo Gallery'
					});
					errorMessage.setMessage('Unexpected error: ' + error.code);
					errorMessage.show();
				}
			});	
		} else {
			//cancel was tapped
		}
		
	});
	dialog.show();
};

module.exports = cameraService;
