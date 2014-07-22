function back(e){
	Alloy.Globals.navController.close();
}

function menu(e){
	Alloy.Globals.navController.toggleMenu(true);	
}

Alloy.Globals.adminModeController.addAdminModeListener($.flyoutBtn);

exports.hideBackBtn = function() {
	$.backBtn.visible = false;
};

exports.setPageTitle = function(title){
	$.pageTitle.text = title;	
};

exports.setBackgroundColor = function(color){
	$.navBar.backgroundColor = color;	
};