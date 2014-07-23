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

var visible = false;
var flyoutMenu;
var time = 0;

var flyoutService = {
	getMenu: function(){
		Ti.API.info("Creating flyout menu");
		if(!flyoutMenu){
			flyoutMenu = Alloy.createController('flyout').getView();
			flyoutMenu.zindex = 1;
			time = 100;
		}
		return flyoutMenu;
	},
	getOpenAnimation: function(){
		return {
			left: "0%",
			curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
			duration: time
		};
	},
	getCloseAnimation: function(){
		return {
			left: "100%",
			curve : Ti.UI.ANIMATION_CURVE_EASE_OUT,
			duration: time
		};
	},
	openMenu: function(){
		if(this.isEnabled()){
			this.getMenu().animate(this.getOpenAnimation());
			visible = true;
		}
		return visible;
	},
	closeMenu: function(){
		this.getMenu().animate(this.getCloseAnimation());
		visible = false;
		return visible;
	},
	closeMenuWithoutAnimation: function(){
		this.getMenu().left = '100%';
		visible = false;
		return visible;
	},
	toggleMenu: function(){
		if(visible)
			return this.closeMenu();
		else
			return this.openMenu();
	},
	isEnabled: function(){
		return !Alloy.Globals.adminModeController.isInKioskMode();
	}
};

module.exports = flyoutService;