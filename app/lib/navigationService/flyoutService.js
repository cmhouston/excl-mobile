var visible = false;
var flyoutMenu;
var time = 0;

var flyoutService = {
	getNewMenu: function(){
		Ti.API.info("Creating flyout menu");

		if(flyoutMenu){
//			flyoutMenu.close();
		}
		
		flyoutMenu = Alloy.createController('flyout').getView();
		flyoutMenu.zindex = 1;
		time = 100;
		
		return flyoutMenu;
	},	
	getMenu: function(){
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
			flyoutMenu.animate(this.getOpenAnimation());
			visible = true;
		}
		return visible;
	},
	closeMenu: function(){
		flyoutMenu.animate(this.getCloseAnimation());
		visible = false;
		return visible;
	},
	closeMenuWithoutAnimation: function(){
		flyoutMenu.left = '100%';
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