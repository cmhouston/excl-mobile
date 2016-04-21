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

var args = arguments[0] || {};
var allChecked;

var filters = Alloy.Collections.filter;
var iconService = setPathForLibDirectory('customCalls/iconService');
var icon = new iconService();
var viewServicePath = setPathForLibDirectory('customCalls/viewService');
var viewService = new viewServicePath();
var loadingSpinner = setPathForLibDirectory('loadingSpinner/loadingSpinner');
var spinner = new loadingSpinner();
var filterService = setPathForLibDirectory('filterService/filterService');
var filter = new filterService();

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
	var active;

	Alloy.Models.app.trigger('change:active');
	active = filter.get('active');

	//Ti.API.info("filter name: " + name + "(" + active + ")");

	var color = Alloy.CFG.excl.colors.darkFontColor;

	var args = {
		color : color,
		font : {

			fontSize : '22dp',
			fontWeight : 'bold',
			fontFamily : Alloy.CFG.excl.defaultGlobalFontFamily
		},
		left : '20%',
		text : name
	};
	var label = Ti.UI.createLabel(args);

	args = {
		value : active,
		right : '15%',
		titleOn : " ",
		titleOff : " ",
		height : "80%"
	};
	var _switch = Ti.UI.createSwitch(args);

	_switch.addEventListener('change', function(e) {
		filter.set('active', _switch.value);
	});

	var rowView = viewService.createView();
	rowView.add(label);
	rowView.add(_switch);

	var row = viewService.createTableRow("40dip");
	row.add(rowView);

	return row;
}

function closeWindow(e) {
	displayMessageOnceDoneButtonIsClicked();
	$.getView().close();
}

function displayMessageOnceDoneButtonIsClicked() {
	// default message
	var messageToDisplay = "The app content has been reorganized for the ages selected.";
	selectedFilters = filter.formatActiveFiltersIntoArray(Alloy.Collections.filter);
	if (JSON.stringify(selectedFilters) == "[]") {
		messageToDisplay = "Customize by age will remain disabled because no age filters were selected.";
	}

	Titanium.UI.createAlertDialog({
		title : '',
		message : messageToDisplay,
		ok : 'Got it!'
	}).show();
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

function setTableBackgroundColor() {
	if (OS_ANDROID) {
		$.filterTable.backgroundColor = "#FFFFFF";
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

function init() {
	Alloy.Globals.navController.toggleMenu();
	setSizeOfWindow();
	addViewBehindModalInIOS();
	setTableBackgroundColor();
	addFilters(allChecked);
	removeSpinner();
}

init();
