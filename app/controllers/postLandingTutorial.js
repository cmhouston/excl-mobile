var args = arguments[0] || {};

var TutorialService = require('tutorialService/tutorialService');
var tutorialService = new TutorialService();


function tutorialExit(e) {
	tutorialService.endTutorialMode();
	$.postTutorialPage.hide();
}

function gotIt(e) {
	tutorialService.gotIt("postLandingTutorial");
	$.postTutorialPage.hide();
	tutorialService.endTutorialMode();	
}