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

function sharingTextService(){
	buttonService = sharingTextService.prototype.setPathForLibDirectory('customCalls/buttonService');
	this.setButtonService( new buttonService() );
	iconService = sharingTextService.prototype.setPathForLibDirectory('customCalls/iconService');
	iconService = new iconService();
	intentService = sharingTextService.prototype.setPathForLibDirectory('customCalls/intentService');
	this.setIntentService( new intentService() );
}

sharingTextService.prototype.setIntentService = function(service){
	intentService = service;
};

sharingTextService.prototype.setButtonService = function(service){
	buttonService = service;
};

sharingTextService.prototype.getIntentService = function(){
	return intentService;
};

sharingTextService.prototype.setPathForLibDirectory = function(libFile){
	if ( typeof Titanium == 'undefined') {
		lib = require("../../lib/" + libFile);
	} else {
		lib = require(libFile);
	}
	return lib;
};

sharingTextService.prototype.initiateTextShareButton = function(json, objectArgs) {
	var shareTextButton = buttonService.createCustomButton(objectArgs);
	sharingTextService.prototype.setIconReady(shareTextButton);

	sharingTextService.prototype.setClickListener(shareTextButton, json);
	
	buttonService.eraseButtonTitleIfBackgroundPresent(shareTextButton);
	return shareTextButton;
};

sharingTextService.prototype.setClickListener = function(shareTextButton, json){
	shareTextButton.addEventListener('click', function(e) {
		sharingTextService.prototype.setIconBusy(shareTextButton);
		postTags = sharingTextService.prototype.getPostTags(json);
		sharingTextService.prototype.initiateIntentText(postTags, shareTextButton);
	});
};

sharingTextService.prototype.setIconReady = function(shareTextButton){
	iconService.setIcon(shareTextButton, 'share_ready.png');
	buttonService.setButtonEnabled(shareTextButton, true);
};

sharingTextService.prototype.setIconBusy = function(shareTextButton){
	iconService.setIcon(shareTextButton, 'share_busy.png');
	buttonService.setButtonEnabled(shareTextButton, false);
};

sharingTextService.prototype.getPostTags = function(json) {
	postTags = json.social_media_message;
	return postTags;
};

sharingTextService.prototype.initiateIntentText = function(postTags, shareTextButton) {
	//Choose appropriate intent creator
	if (OS_ANDROID) {
		intentService.sendIntentTextAndroid(postTags);
	} else if (OS_IOS) {
		intentService.sendIntentTextiOS(postTags);
	}
	sharingTextService.prototype.setIconReady(shareTextButton);
};

module.exports = sharingTextService;
