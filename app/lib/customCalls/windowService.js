function windowService(){};

windowService.prototype.createCustomWindow = function(args) {
	var window = Ti.UI.createWindow(args);
	return window;
};

windowService.prototype.createCustomTab = function(args) {
	var tab = Ti.UI.createTab(args);
	return tab;
};

windowService.prototype.createCustomTabGroup = function(args) {
	var tabGroup = Ti.UI.createTabGroup(args);
	return tabGroup;
};

module.exports = windowService;