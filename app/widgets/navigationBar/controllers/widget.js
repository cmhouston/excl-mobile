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

var labelService = setPathForLibDirectory("customCalls/labelService");
labelService = new labelService();
var detectDevice = setPathForLibDirectory("customCalls/deviceDetectionService");
detectDevice = new detectDevice();

function setPathForLibDirectory(libFile) {
	if ( typeof Titanium == 'undefined') {
		lib = require("../../lib/" + libFile);
	} else {
		lib = require(libFile);
	}
	return lib;
}

function back(e) {
	Alloy.Globals.navController.close();
}

function menu(e) {
	Alloy.Globals.navController.toggleMenu(true);
}

Alloy.Globals.adminModeController.addAdminModeListener($.navBar);

exports.hideBackBtn = function() {
	$.backBtn.visible = false;
};

exports.unHideBackBtn = function() {
	$.backBtn.visible = true;
};

exports.hideMenuBtn = function() {
	$.flyoutBtn.visible = false;
};

exports.unHideMenuBtn = function() {
	$.flyoutBtn.visible = true;
};

exports.setPageTitle = function(title) {
	$.pageTitle.text = title;
};

exports.setBackgroundColor = function(color) {
	$.navBar.backgroundColor = color;
};

exports.onEnterKioskMode = function() {
	this.hideBackBtn();
	this.hideMenuBtn();
};

exports.onExitKioskMode = function() {
	this.unHideBackBtn();
	this.unHideMenuBtn();
};
