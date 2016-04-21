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

var iconCameraReady = "/images/icons_android/ic_action_camera_ready.png";
var iconCameraBusy = "/images/icons_android/ic_action_camera_busy.png";
var iconTextShareReady = "/images/icons_android/ic_action_share_ready.png";
var iconTextShareBusy = "/images/icons_android/ic_action_share_busy.png";

function changeButtonIconToReadyForImageAndroid(buttonId) {
	buttonId.backgroundImage = iconCameraReady;
}
function changeButtonIconToBusyForImageAndroid(buttonId) {
	buttonId.backgroundImage = iconCameraBusy;
}
function changeButtonIconToReadyForTextAndroid(buttonId) {
	buttonId.backgroundImage = iconTextShareReady;
}
function changeButtonIconToBusyForTextAndroid(buttonId) {
	buttonId.backgroundImage = iconTextShareBusy;
}


module.exports = androidService;