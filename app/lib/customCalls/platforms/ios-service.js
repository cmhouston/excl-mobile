var iconCameraReady = "images/icons_ios/iOScamera.png";
var iconCameraBusy = "images/icons_ios/iOScameraGray.png";
var iconTextShareReady = "images/icons_ios/iosShare.png";
var iconTextShareBusy = "images/icons_ios/iosShareGray.png";

function openInstagram(imageFilePathInstagram, rightNavButton) {

	alert("About to try opening docViewer. imageFilePathInstagram: " + imageFilePathInstagram);

	var docViewer = networkSharingService.openInstagramView(imageFilePathInstagram);
	alert("Finished openInstagramView");
	docViewer.UTI = "com.instagram.exclusivegram";
	docViewer.show({ view : rightNavButton, animated : true });
}

function changeButtonIconToReadyForImageIOS(buttonId) {
	buttonId.backgroundImage = iconCameraReady;
}
function changeButtonIconToBusyForImageIOS(buttonId) {
	buttonId.backgroundImage = iconCameraBusy;
}
function changeButtonIconToReadyForTextIOS(buttonId) {
	buttonId.backgroundImage = iconTextShareReady;
}
function changeButtonIconToBusyForTextIOS(buttonId) {
	buttonId.backgroundImage = iconTextShareBusy;
}



module.exports = iosService;