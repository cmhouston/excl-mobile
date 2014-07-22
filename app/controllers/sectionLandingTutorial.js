var args = arguments[0] || {};

var TutorialService = require('tutorialService/tutorialService');
var tutorialService = new TutorialService();

function tutorialExit(e) {
	tutorialService.endTutorialMode();
	$.sectionTutorialPage.hide();
}

function gotIt(e) {
	tutorialService.gotIt("sectionLandingTutorial");
	$.sectionTutorialPage.hide();
}