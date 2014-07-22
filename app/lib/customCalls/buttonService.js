function buttonService() {
};
//Provides functions to deal with buttons

//Parameters id and title are optional
buttonService.prototype.createButton = function(id, title) {
	id = id || "";
	title = title || "";

	var button = Ti.UI.createButton({
		height : "40dip",
		width : "40dip",
		left : "0",
		top : "0",
		id : id,
		title : title
	});
	return button;
};

buttonService.prototype.createCustomButton = function(args) {
	var button = Ti.UI.createButton(args);
	return button;
};

buttonService.prototype.createCheckbox = function() {
	var checkbox = Ti.UI.createButton({
		right : "5%",
		borderColor : '#666',
		borderWidth : 2,
		borderRadius : 3,
		backgroundColor : '#aaa',
		backgroundImage : 'none',
		color : '#fff',
		font : {
			fontSize : 25,
			fontWeight : 'bold'
		},
		value: false
	});
	checkbox.addEventListener('click', function(e) {
		if (checkbox.value) {
			checkbox.backgroundColor = '#007690';
			checkbox.title = '\u2713';
		} else {
			checkbox.backgroundColor = '#aaa';
			checkbox.title = '';
		}
	});
	return checkbox;
};

buttonService.prototype.createButtonWithCustomSize = function(title, heightAsDip, widthAsDip) {
	title = title || "";
	heightAsDip = heightAsDip || "40";
	widthAsDip = widthAsDip || "40";
	var button = Ti.UI.createButton({
		height : heightAsDip + "dip",
		width : widthAsDip + "dip",
		left : "0",
		top : "0",
		title : title
	});
	return button;
};

buttonService.prototype.setButtonEnabled = function(button, bol) {
	button.enabled = bol;
};

buttonService.prototype.eraseButtonTitleIfBackgroundPresent = function(button) {
	if (button.backgroundImage != "") {
		button.title = "";
	}
};

module.exports = buttonService;
