function iconService(){}
//Finds the platform-specific icon from the images/icons_[platform] directory
var iconRootAndroid = "/images/icons_android/";
var iconRootIos = "images/icons_ios/";

iconService.prototype.setIcon = function(button, filename){	
	if (OS_ANDROID){
		button.backgroundImage = iconRootAndroid + filename;
	}
	else if (OS_IOS){
		button.backgroundImage = iconRootIos + filename;
	}
};

module.exports = iconService;