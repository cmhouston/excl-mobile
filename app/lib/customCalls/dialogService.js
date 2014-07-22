function dialogService() {
};

dialogService.prototype.createAlertDialog = function(message, title){
	message = message || "Alert!";
	
	alertDialog = Ti.UI.createAlertDialog({
        message: message,
	});
	if (title){
		alertDialog.title = title;
	}
	return alertDialog;
};

module.exports = dialogService;
