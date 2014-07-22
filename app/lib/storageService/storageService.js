var rootPath = (typeof Titanium == 'undefined')? '../../lib/' : '';
var tiService = require(rootPath + 'customCalls/tiService');

var StorageService = function() {
};

StorageService.prototype.setBoolProperty = function(key, value) {
	tiService.App.Properties.setBool(key, value);
};

StorageService.prototype.getBoolProperty = function(key) {
	return tiService.App.Properties.getBool(key);
};

StorageService.prototype.setStringProperty = function(key, value) {
	tiService.App.Properties.setString(key, value);
};

StorageService.prototype.getStringProperty = function(key) {
	return tiService.App.Properties.getString(key);
};

module.exports = StorageService;