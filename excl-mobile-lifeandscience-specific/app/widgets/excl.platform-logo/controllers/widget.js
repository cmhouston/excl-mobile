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

function animate() {
	// Determine rotation degrees based on platform
	var rotationDegrees = 0;
	if (OS_ANDROID){
		rotationDegrees = 360;
	} else if (OS_IOS) {
		rotationDegrees = -360;
	}
	
	// Spin!
	var matrix2d = Ti.UI.create2DMatrix();
	matrix2d = matrix2d.rotate(rotationDegrees);
	var a = Ti.UI.createAnimation({
	    transform: matrix2d,
	    duration: 1000,
	    autoreverse: false,
	    repeat: 3
	});
	$.logoView.animate(a);
}

var init = function(options) {
	// Determine which logo path to use based on platform
	var logoPath = "";
	if (OS_ANDROID){
		logoPath = options.androidLogoPath;
	} else if (OS_IOS) {
		logoPath = options.iosLogoPath;
	}
	
	// Show logo
	$.logoView.image = logoPath;
	$.logoView.anchorPoint = {
        x : 0.5,
        y : 0.5
	};
	
	animate();
};

exports.init = init;