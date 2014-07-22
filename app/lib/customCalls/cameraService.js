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
	loadingSpinner = new loadingSpinner();
};

cameraService.prototype.takePicture = function(postTags, shareImageButton, instagramAnchor) {
	var imageFilePath;
	var dialog = Titanium.UI.createOptionDialog({
		title : 'Choose an image source...',
		options : ['Camera', 'Photo Gallery', 'Cancel'],
		cancel : 2
	});
	dialog.addEventListener("click", function(e) {
		if (OS_IOS) {
			var selectedIndex = e.index;
		} else if (OS_ANDROID) {
			var selectedIndex = dialog.selectedIndex;
		}
		if (OS_ANDROID) {
			var win = Titanium.UI.currentWindow;
			var view = Ti.UI.createView({
				backgroundColor : "black"
			});
			win.add(view);
			loadingSpinner.addTo(view);
			loadingSpinner.show();
		}
		if (selectedIndex == 0) {
			Titanium.Media.showCamera({
				saveToPhotoGallery : true,
				allowImageEditing : true,
				saveToPhotoGallery : true,
				mediaTypes : Titanium.Media.MEDIA_TYPE_PHOTO,
				success : function(event) {
					var fileName = 'excl' + new Date().getTime() + '.jpg';
					var imageFile = Ti.Filesystem.getFile('file:///sdcard/').exists() ? Ti.Filesystem.getFile('file:///sdcard/', fileName) : Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, fileName);
					imageFile.write(event.media);
					if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
						imageFilePath = imageFile.nativePath;
						if (OS_ANDROID) {
							loadingSpinner.hide();
							view.hide();
							intentService.sendIntentImageAndroid(postTags, imageFilePath);
						} else if (OS_IOS) {
							fileNameInstagram = "excl" + new Date().getTime() + "_temp.ig";
							imageFileInstagram = Ti.Filesystem.getFile(Ti.Filesystem.tempDirectory, fileNameInstagram);
							imageFileInstagram.write(event.media);
							intentService.sendIntentImageiOS(postTags, imageFilePath, imageFileInstagram.getNativePath(), instagramAnchor);
						}
					}
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
