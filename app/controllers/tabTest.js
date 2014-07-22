var args = arguments[0] || {};
var lastSelectedButton;

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

		var view = createNewView('black', "viewOfButton" + i);
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
	JSON.stringify(buttonSource.viewAssociatedId);
	Ti.API.info("===========");
	var mainViewJson = JSON.stringify($.mainView);
	var mainViewJsonParsed = JSON.parse(mainViewJson);
	Ti.API.info(mainViewJsonParsed.children);
	for(var i=0; i<mainViewJsonParsed.children.length; i++){
		Ti.API.info(mainViewJsonParsed.children[i].id);
		if (buttonSource.viewAssociatedId == mainViewJsonParsed.children[i].id){
			Ti.API.info("````` " + buttonSource.viewAssociatedId +"````` " );
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
		top : '60%',
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