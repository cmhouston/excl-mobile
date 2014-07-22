var args = arguments[0] || {};
var allChecked;

var filters = Alloy.Collections.filter;
var iconService = setPathForLibDirectory('customCalls/iconService');
var icon = new iconService();
var viewServicePath = setPathForLibDirectory('customCalls/viewService');
var viewService = new viewServicePath();
var loadingSpinner = setPathForLibDirectory('loadingSpinner/loadingSpinner');
var spinner = new loadingSpinner();

function addSpinner() {
	spinner.addTo($.win);
	spinner.show();
}

function removeSpinner() {
	spinner.hide();
}

function setPathForLibDirectory(libFile) {
	if ( typeof Titanium == 'undefined') {
		lib = require("../../lib/" + libFile);
	} else {
		lib = require(libFile);
	}
	return lib;
};

function createFilterView(filter, allChecked) {
	var name = filter.get('name');
	
	Ti.API.info("name: " + name);
	
	var active;

	if (allChecked == "enable") {
		filter.set('active', "true");
	} else if (allChecked == "disable") {
		filter.set('active', "false");
	}
	Alloy.Models.app.trigger('change:active');
	active = filter.get('active');

	var color = 'white';
	if (OS_IOS) {
		color = 'black';
		$.titleBar.top = '10dip';
		$.hint.color = 'white';
	}

	var args = {
		color : color,
		font : {
			fontFamily : 'Helvetica Neue',
			fontSize : '22dp',
			fontWeight : 'bold'
		},
		left : '20%',
		text : name
	};
	var label = Ti.UI.createLabel(args);

	args = {
		value : active,
		right : '15%',
		titleOn : " ",
		titleOff : " "
	};
	var _switch = Ti.UI.createSwitch(args);

	_switch.addEventListener('change', function(e) {
		allChecked = "none";
		filter.set('active', _switch.value);
	});

	var rowView = viewService.createView();
	rowView.add(label);
	rowView.add(_switch);

	var row = viewService.createTableRow("35dip");
	row.add(rowView);

	return row;
}

function closeWindow(e) {
	$.getView().close();
}

function addFilters(allChecked) {
	var tableData = [];
	addSpinner();
	for (var i = 0; i < filters.size(); i++) {
		var filter = filters.at(i);
		filter = createFilterView(filter, allChecked);
		tableData.push(filter);
	};
	$.filterTable.data = tableData;
	//Ti.API.info("Filter Status 1: " + JSON.stringify(Alloy.Collections.filter));
}

function resetFilters(newAllCheckedValue) {
	allChecked = newAllCheckedValue;
	$.filterTable.data = [];
	addFilters(allChecked);
	removeSpinner();
}

function formatCheckAllOnButton(button) {
	icon.setIcon(button, "checkbox_checked.png");
	button.left = "70%";

	button.addEventListener('click', function(e) {
		resetFilters("enable");
	});
}

function formatCheckAllOffButton(button) {
	icon.setIcon(button, "checkbox_unchecked.png");
	button.left = "7%";

	button.addEventListener('click', function(e) {
		resetFilters("disable");
	});
}

function setTableBackgroundColor() {
	if (OS_ANDROID) {
		$.filterTable.backgroundColor = "black";
	}
}

function setSizeOfWindow() {
	if (Ti.Platform.osname == "iphone") {
		$.container.modal = false;
		$.filterTable.bottom = "48dip";
		$.filterTable.height = Ti.UI.FILL;
	} else if (Ti.Platform.osname == "ipad") {
		$.container.modal = false;
		$.filterTable.height = Ti.UI.SIZE;
		$.container.height = Ti.UI.SIZE;
	} else {
		$.win.modal = true;
		$.filterTable.height = Ti.UI.FILL;
	}
}

function addViewBehindModalInIOS() {
	if (OS_IOS) {
		Ti.API.info("Triggered view addition");
		var view = viewService.createView();
		view.add($.container);
		$.win.remove($.container);
		$.win.add(view);
	}
}

function formatCloseButtonColor() {
	if (OS_ANDROID) {
		$.close.color = "white";
		$.close.backgroundColor = "#303030";
		$.close.borderColor = "white";
		$.close.borderRadius = "3";
		$.close.borderWidth = "1";
	} else {
		$.close.color = "#00FFFF";
	}
}

function init() {
	Alloy.Globals.navController.toggleMenu();
	setSizeOfWindow();
	addViewBehindModalInIOS();
	setTableBackgroundColor();
	formatCloseButtonColor();
	formatCheckAllOnButton($.toggleAllOn);
	formatCheckAllOffButton($.toggleAllOff);
	addFilters(allChecked);
	removeSpinner();
}

init();
