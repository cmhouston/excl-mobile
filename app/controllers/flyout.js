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
var APICalls = setPathForLibDirectory("customCalls/apiCalls");
var json = Alloy.Globals.museumJSON;
var ageFilterOn = Alloy.Models.app.get("customizeLearningEnabled");
var ageFilterSet = Alloy.Models.app.get("customizeLearningSet");
var viewService = setPathForLibDirectory('customCalls/viewService');
viewService = new viewService();
var buttonService = setPathForLibDirectory('customCalls/buttonService');
buttonService = new buttonService();
var dialogService = setPathForLibDirectory('customCalls/dialogService');
dialogService = new dialogService();
var languageService = setPathForLibDirectory('languageService/languageService');
languageService = new languageService();
var TutorialService = setPathForLibDirectory('tutorialService/tutorialService');
var tutorialService = new TutorialService();
var retriever = Alloy.Globals.setPathForLibDirectory('dataRetriever/dataRetriever');

Alloy.Models.app.on('change:tutorialOn', updateTutorialUI);
Alloy.Models.app.on('change:customizeLearningSet', activateFiltersWithSet);
Alloy.Models.app.on('change:customizeLearningEnabled', activateFiltersWithEnable);
Alloy.Models.app.on('change:currentLanguage', onLanguageChange);

function setPathForLibDirectory(libFile) {
	if ( typeof Titanium == 'undefined') {
		lib = require("../../lib/" + libFile);
	} else {
		lib = require(libFile);
	}
	return lib;
};

function activateFiltersWithSet() {
	ageFilterSet = Alloy.Models.app.get('customizeLearningSet');
	if (ageFilterSet) {
		activateFiltersWithEnable();
	} else {
		//This spot is for a reset function that will "reset filtering to startup conditions". This does not seem relevant.
	}
}

function activateFiltersWithEnable() {
	ageFilterOn = Alloy.Models.app.get('customizeLearningEnabled');
	if (ageFilterSet && ageFilterOn) {
		enableAgeFilter();
	} else if (!ageFilterSet && ageFilterOn) {
		disableAgeFilter();
	}
}

function toggleCustomLearning() {
	if (ageFilterOn) {
		Alloy.Models.app.set('customizeLearningEnabled', false);
		APICalls.info("Customized Learning Disabled");
		formatRowEnable();
	} else {
		Alloy.Models.app.set('customizeLearningEnabled', true);
		APICalls.info("Customized Learning Enabled");
		formatRowDisable();
	}
	closeMenu();
}

function closeMenu(e) {
	return Alloy.Globals.navController.toggleMenu(false);
}

function openHomePage(e) {
	Alloy.Globals.navController.home();
	closeMenu();
}

function openExhibitsPage(e) {
	Alloy.Globals.navController.open(Alloy.createController("exhibitLanding"));
	closeMenu();
}

function openMapPage(e) {
	var controller = Alloy.createController("map", eval([json]));
	Alloy.Globals.navController.open(controller);
	closeMenu();
}

function openInfoPage(e) {
	var controller = Alloy.createController("info", eval([json]));
	Alloy.Globals.navController.open(controller);
	closeMenu();
}

function setCustomLearn(e) {
	var ready = Alloy.Collections.filter.ready;
	if (ready) {
		Alloy.Models.app.set('customizeLearningSet', true);
		Alloy.createController('filterActivationModal').getView().open();
		enableAgeFilter();
	} else {
		Alloy.Models.app.retrieveFilters();
		alert('Attempting to retrieve filters.  Try again in a moment.');
	}
}

function enableAgeFilter() {
	$.agesLabel.text = "Turn Filter Off";
	$.customLearnRow.backgroundColor = "C0C0C0";
	showEditAgeOption();
}

function disableAgeFilter() {
	$.agesLabel.text = "Turn Filter On";
	$.customLearnRow.backgroundColor = "F2F2F2";
	hideEditAgeOption();
}

function showEditAgeOption() {
	$.viewRowCollapsible.height = "50dip";
	$.toggleView.show();
}

function hideEditAgeOption() {
	$.viewRowCollapsible.height = 0;
	$.toggleView.hide();
}

function rowFilterEventListener() {
	if (ageFilterSet && ageFilterOn) {
		Ti.API.info("Filter disabled");
		Alloy.Models.app.set("customizeLearningEnabled", false);
		disableAgeFilter();
		closeMenu();
	} else if (ageFilterSet && !ageFilterOn) {
		Ti.API.info("Filter enabled");
		Alloy.Models.app.set("customizeLearningEnabled", true);
		enableAgeFilter();
		closeMenu();
	} else if (!ageFilterSet && !ageFilterOn) {
		Ti.API.info("Custom Learning Set");
		Alloy.Models.app.set("customizeLearningEnabled", true);
		setCustomLearn();
	} else {
		Ti.API.info("Unrecognized filter set/enable combination");
	}
	ageFilterSet = Alloy.Models.app.get('customizeLearningSet');
	ageFilterOn = Alloy.Models.app.get('customizeLearningEnabled');
	Ti.API.info("Filter Fired (fly): set: " + ageFilterSet + ", on: " + ageFilterOn);
}

function tutorialToggler(e) {
	if (!Alloy.Models.app.get("tutorialOn")) {
		var dialog = Ti.UI.createAlertDialog({
			cancel : 1,
			buttonNames : ['Yes', 'Nevermind'],
			message : 'Would you like to begin the tutorial again? This will start you at the home screen of the app.',
			title : 'Tutorial Mode'
		});
		dialog.addEventListener('click', function(e) {
			if (e.index !== e.source.cancel) {
				tutorialService.resetTutorialMode();
			}
		});
		dialog.show();
	} else {
		tutorialService.endTutorialMode();
	}
	updateTutorialUI();
}

function updateTutorialUI() {
	if (Alloy.Models.app.get("tutorialOn")) {
		$.tutorialLabel.text = "Tutorial is On";
	} else {
		$.tutorialLabel.text = "Tutorial is Off";
	}
}

function languageHandler(e) {
	languageService.displayDialog();
}

function onLanguageChange() {
	setMuseumJSONWithLanguageDialog();
	Alloy.Models.app.forceRestartWithFreshData();
}

function setMuseumJSONWithLanguageDialog() {
	var url = Alloy.Globals.rootWebServiceUrl;
	retriever.fetchDataFromUrl(url, function(response) {
		if (!retriever.checkIfDataRetrieverNull(response)) {
			Alloy.Globals.museumJSON = response;
			createInternationalizationMessageDialog();
		}
	});
}

function createInternationalizationMessageDialog() {
	var message = Alloy.Globals.museumJSON.data.museum.internationalization_message;
	if (message != '') {
		alertDialog = dialogService.createAlertDialog(message);
		alertDialog.buttonNames = ["Ok"];
		alertDialog.show();
	}
}

function detectFilterConditions() {
	//Can't Ti.API.info variables here
	ageFilterSet = Alloy.Models.app.get('customizeLearningSet');
	ageFilterOn = Alloy.Models.app.get('customizeLearningEnabled');
	if (ageFilterSet && ageFilterOn) {
		disableAgeFilter();
	} else if (ageFilterSet && !ageFilterOn) {
		enableAgeFilter();
	} else if (!ageFilterSet && !ageFilterOn) {
		//setCustomLearn();
	} else {
		Ti.API.info("Unrecognized filter set/enable combination");
	}
	Ti.API.info("Filter StartUp (fly): set: " + ageFilterSet + ", on: " + ageFilterOn);
}

detectFilterConditions();
