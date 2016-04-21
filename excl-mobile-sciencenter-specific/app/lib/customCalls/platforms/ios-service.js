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

var iconCameraReady = "images/icons_ios/iOScamera.png";
var iconCameraBusy = "images/icons_ios/iOScameraGray.png";
var iconTextShareReady = "images/icons_ios/iosShare.png";
var iconTextShareBusy = "images/icons_ios/iosShareGray.png";

function openInstagram(imageFilePathInstagram, rightNavButton) {

	alert("About to try opening docViewer. imageFilePathInstagram: " + imageFilePathInstagram);

	var docViewer = networkSharingService.openInstagramView(imageFilePathInstagram);
	alert("Finished openInstagramView");
	docViewer.UTI = "com.instagram.exclusivegram";
	docViewer.show({ view : rightNavButton, animated : true });
}

function changeButtonIconToReadyForImageIOS(buttonId) {
	buttonId.backgroundImage = iconCameraReady;
}
function changeButtonIconToBusyForImageIOS(buttonId) {
	buttonId.backgroundImage = iconCameraBusy;
}
function changeButtonIconToReadyForTextIOS(buttonId) {
	buttonId.backgroundImage = iconTextShareReady;
}
function changeButtonIconToBusyForTextIOS(buttonId) {
	buttonId.backgroundImage = iconTextShareBusy;
}



module.exports = iosService;