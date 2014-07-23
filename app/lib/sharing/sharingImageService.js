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

sharingImageService.prototype.initiateImageShareButton = function(json, objectArgs) {
	var shareImageButton = buttonService.createCustomButton(objectArgs);
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