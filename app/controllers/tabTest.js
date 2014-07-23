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
var lastSelectedButton;
var lastSelectedView;
var colorArray = ['#ECD078', '#D95B43', '#C02942', '#542437', '#53777A'];
var colorArrayCounter = 0;

function textSubmitted() {
	Ti.API.info($.insertText.value);
	insertXNumberOfButtons(parseInt($.insertText.value));
}

function insertXNumberOfButtons(numberOfButtons) {
	var buttonHolderView = Titanium.UI.createView({
		borderRadius : 0,
		backgroundColor : '#E74C3C',
		width : '100%',
		height : 50,
		top : '40%',
		layout : 'horizontal',
		id : 'buttonHolderView'
	});

	var each_button_width = 100 / numberOfButtons;
	each_button_width += '%';

	for (var i = 0; i < numberOfButtons; i++) {
		var button = createButtonWithGivenWidth(each_button_width, i, "viewOfButton" + i);

		var view = createNewView(colorArray[colorArrayCounter], "viewOfButton" + i);
		colorArrayCounter++;
		$.mainView.add(view);

		button.addEventListener('click', function(e) {
			Ti.API.info(JSON.stringify(e.source));
			changeButtonColor(e.source);
			showRespectiveView(e.source);
		});
		buttonHolderView.add(button);
	}

	$.mainView.add(buttonHolderView);
}

function showRespectiveView(buttonSource) {
	for (var child in $.mainView.children) {
		if ($.mainView.children[child].id) {
			if (buttonSource.viewAssociatedId == $.mainView.children[child].id) {
				if (lastSelectedView) {
					$.mainView.children[lastSelectedView].visible = false;
				}
				$.mainView.children[child].visible = true;
				lastSelectedView = child;
			}
		}
	}
}

function createButtonWithGivenWidth(button_width, i, viewId) {
	// passing the 'i' for now
	// needs to be removed later
	var button = Titanium.UI.createButton({
		title : "Number " + i,
		width : button_width,
		height : 50,
		borderColor : '#E74C3C',
		borderRadius : 10,
		backgroundColor : '#1ABC9C',
		color : '#ECF0F1',
		id : "button" + i,
		viewAssociatedId : viewId
	});
	return button;
}

function createNewView(backgroundColorOfView, viewId) {
	var view = Titanium.UI.createView({
		borderRadius : 30,
		backgroundColor : backgroundColorOfView,
		width : '100%',
		height : '100%',
		top : '50%',
		visible : false,
		id : viewId
	});
	return view;
}

function changeButtonColor(buttonId) {
	if (lastSelectedButton) {
		// if lastSelectedButton exists then this will be executed
		lastSelectedButton.backgroundColor = '#1ABC9C';
		lastSelectedButton.color = '#ECF0F1';
	}
	buttonId.backgroundColor = '#ECF0F1';
	buttonId.color = '#1ABC9C';
	lastSelectedButton = buttonId;
}

$.navBar.setPageTitle("~  Testing page  ~");
$.container.open();
