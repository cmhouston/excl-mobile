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

function deviceDetectionService() {
};

deviceDetectionService.prototype.isTablet = function(diagonalInches) {
	//Somewhat arbitrary cutoff where formatting changes in android devices
	var androidTabletScreenDiagInches = 8;
	////
	var tabletDiag = diagonalInches | androidTabletScreenDiagInches;
	var osname = Ti.Platform.osname;
	switch(osname) {
	case 'ipad':
		return true;
	case 'android':
		return (deviceDetectionService.prototype.deviceDiag() >= tabletDiag) ? true : false;
	default:
		return false;
	}
};

deviceDetectionService.prototype.deviceDiag = function() {
	/*
	 Returns the DIAGONAL screen size in inches
	 */
	var dpi = Ti.Platform.displayCaps.dpi;
	var screenWidth = Ti.Platform.displayCaps.platformWidth / dpi;
	var screenHeight = Ti.Platform.displayCaps.platformHeight / dpi;
	return Math.sqrt(screenWidth * screenWidth + screenHeight * screenHeight);
};

deviceDetectionService.prototype.getHeight = function() {
	return Ti.Platform.displayCaps.platformHeight;
};

deviceDetectionService.prototype.getWidth = function() {
	return Ti.Platform.displayCaps.platformWidth;
};

deviceDetectionService.prototype.getDpi = function() {
	return Ti.Platform.displayCaps.getDpi();
};

deviceDetectionService.prototype.dipToPx = function(dipSize){
	var pxSize = dipSize * (this.getDpi() / 160);
	return pxSize;
};

deviceDetectionService.prototype.pxToDip = function(pxSize){
	var dipSize = pxSize / (this.getDpi() / 160);
	return dipSize;
};

module.exports = deviceDetectionService; 