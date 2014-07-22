

function LoadingSpinner() {
	var style;
	if (OS_IOS){
	  style = Ti.UI.iPhone.ActivityIndicatorStyle.DARK;
	}
	else if (OS_ANDROID) {
	  style = Ti.UI.ActivityIndicatorStyle.BIG_DARK;
	}
	this.spinner = Ti.UI.createActivityIndicator({
	  style: style,
	  height: Ti.UI.SIZE,
	  width: Ti.UI.SIZE
	});
}

LoadingSpinner.prototype.addTo = function(element){
	element.add(this.spinner);
};

LoadingSpinner.prototype.show = function(){
	this.spinner.show();
};

LoadingSpinner.prototype.hide = function(){
	this.spinner.hide();
};

module.exports = LoadingSpinner;