function viewService(){};

viewService.prototype.createModalInputView = function() {
	var modal = Ti.UI.createView({
		modal: true,
		top: "10%",
		width: "80%",
		borderRadius:"10dip",
		backgroundColor: "#000000"
	});
	return modal;
};

viewService.prototype.createView = function() {
	var view = Ti.UI.createView({});
	return view;
};

viewService.prototype.createCustomView = function(args) {
	var view = Ti.UI.createView(args);
	return view;
};

viewService.prototype.createCustomImageView = function(args) {
	var view = Ti.UI.createImageView(args);
	return view;
};

viewService.prototype.createCustomScrollView = function(args) {
	var scrollView = Ti.UI.createScrollView(args);
	return scrollView;
};

viewService.prototype.createTableView = function() {
	var table = Ti.UI.createTableView({});
	return table;
};

viewService.prototype.createTableRow = function (heightWithUnit){
	heightWithUnit = heightWithUnit || "25%";
	var row = Ti.UI.createTableViewRow({
		height: heightWithUnit
	});
	return row;
};

viewService.prototype.createTableSection = function(){
	var table = Ti.UI.createTableViewSection({});
	return table;
};

module.exports = viewService;