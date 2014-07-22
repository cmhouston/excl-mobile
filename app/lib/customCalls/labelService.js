function labelService(){};

labelService.prototype.createLabel = function(text) {
	var label = Ti.UI.createLabel({
		text: text
	});
	return label;
};
labelService.prototype.createCustomLabel = function(args) {
	var label = Ti.UI.createLabel(args);
	return label;
};

module.exports = labelService;