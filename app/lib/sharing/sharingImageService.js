function setPathForLibDirectory(libFile){
	if ( typeof Titanium == 'undefined') {
		lib = require("../../lib/" + libFile);
	} else {
		lib = require(libFile);
	}
	return lib;
};
function sharingImageService(){
	buttonService = setPathForLibDirectory('customCalls/buttonService');
	buttonService = new buttonService();
	iconService = setPathForLibDirectory('customCalls/iconService');
	iconService = new iconService();
	intentService = setPathForLibDirectory('customCalls/intentService');
	intentService = new intentService();
	cameraService = setPathForLibDirectory('customCalls/cameraService');
	cameraService = new cameraService();
}

sharingImageService.prototype.initiateImageShareButton = function(json, instagramAnchor) {
	var shareImageButton = buttonService.createButton('shareImageButton', 'Image');
	sharingImageService.prototype.setIconReady(shareImageButton);

	shareImageButton.addEventListener('click', function(e) {
		sharingImageService.prototype.setIconBusy(shareImageButton);
		postTags = sharingImageService.prototype.getPostTags(json);
		//var intentFunction = function() { sharingImageService.prototype.initiateIntentImage(postTags, imageFilePath, shareImageButton); };
		cameraService.takePicture(postTags, shareImageButton, instagramAnchor);
		sharingImageService.prototype.setIconReady(shareImageButton);
	});
	
	buttonService.eraseButtonTitleIfBackgroundPresent(shareImageButton);
	return shareImageButton;
};


sharingImageService.prototype.setIconReady = function(shareImageButton){
	iconService.setIcon(shareImageButton, 'camera_ready.png');
	buttonService.setButtonEnabled(shareImageButton, true);
};

sharingImageService.prototype.setIconBusy = function(shareImageButton){
	iconService.setIcon(shareImageButton, 'camera_busy.png');
	buttonService.setButtonEnabled(shareImageButton, false);
};

sharingImageService.prototype.getPostTags = function(json) {
	postTags = json.social_media_message;
	return postTags;
};

module.exports = sharingImageService;