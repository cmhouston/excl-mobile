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

iconService.prototype.getImageFilename = function(filename){
	if (OS_ANDROID){
		imageFilename = iconRootAndroid + filename;
	}
	else if (OS_IOS){
		imageFilename = iconRootIos + filename;
	}
	return imageFilename;
};

module.exports = iconService;