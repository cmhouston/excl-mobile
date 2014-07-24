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



function LoadingSpinner(addMessage) {
	addMessage = addMessage || false;
	
	this.loadingMessages = ["Cooking up some fun...", "Activities are on their way!", "Get excited!", "Firing up!", "Turning on the engines...", "Finding some fun...", "Sounding the horn!", "Getting pumped...", "Diving in...", "Preparing to launch..." ];
	
	var style;
	var message;
	var color;
	var top;
	if (OS_IOS) {
		style = Ti.UI.iPhone.ActivityIndicatorStyle.BIG;
		if (addMessage) {
			message = this.loadingMessages[Math.floor(Math.random() * (this.loadingMessages.length))];
		}
		color = '#FFFFFF'; //Text color
		top = "30%";
	} else if (OS_ANDROID) {
		style = Ti.UI.ActivityIndicatorStyle.BIG_DARK;
	}
	this.spinner = Ti.UI.createActivityIndicator({
		style : style,
		height : Ti.UI.SIZE,
		width : Ti.UI.SIZE,
		message : message,
		color : color,
		top : top
	});
}

LoadingSpinner.prototype.makeDark = function(){
	//Default for iOS is big and white; default for Android is big and dark. iOS has no throbber that is both big and dark, so this also results in a smaller throbber.
	var style;
	style = OS_IOS? Ti.UI.iPhone.ActivityIndicatorStyle.DARK : Ti.UI.ActivityIndicatorStyle.BIG_DARK;
	this.spinner.setStyle(style);
};

LoadingSpinner.prototype.setTop = function(top){
	//Default is 30% from top of page
	this.spinner.setTop(top);
};

LoadingSpinner.prototype.scrambleMessage = function(){
	var message = this.loadingMessages[Math.floor(Math.random() * (this.loadingMessages.length))];
	this.spinner.setMessage(message);
};

LoadingSpinner.prototype.addTo = function(element) {
	element.add(this.spinner);
};

LoadingSpinner.prototype.show = function(addMessage) {
	addMessage = addMessage || false;
	if (addMessage && OS_IOS){	
		LoadingSpinner.prototype.scrambleMessage();
	}
	this.spinner.show();
};

LoadingSpinner.prototype.hide = function() {
	this.spinner.hide();
};

LoadingSpinner.prototype.getSpinner = function() {
	return this.spinner;
};

module.exports = LoadingSpinner; 