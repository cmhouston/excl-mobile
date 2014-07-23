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