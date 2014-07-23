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
	if (Titanium.Platform.osname == "ipad") {
		$.pageTitle.font = {
			fontSize : "30dip"
		};
	}
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
