var loadingMessages = ["Cooking up some fun...", "Activities are on their way!", "Get excited!", "Firing up!", "Turning on the engines...", "Finding some fun...", "Sounding the horn!"];

function LoadingSpinner(addMessage) {
	addMessage = addMessage || false;
	var style;
	var message;
	var color;
	var top;
	if (OS_IOS) {
		style = Ti.UI.iPhone.ActivityIndicatorStyle.BIG;
		if (addMessage) {
			message = loadingMessages[Math.floor(Math.random() * (loadingMessages.length))];
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

LoadingSpinner.prototype.addTo = function(element) {
	element.add(this.spinner);
};

LoadingSpinner.prototype.show = function() {
	this.spinner.show();
};

LoadingSpinner.prototype.hide = function() {
	this.spinner.hide();
};

LoadingSpinner.prototype.getSpinner = function() {
	return this.spinner;
};

module.exports = LoadingSpinner; 