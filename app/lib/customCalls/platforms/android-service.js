var iconCameraReady = "/images/icons_android/ic_action_camera_ready.png";
var iconCameraBusy = "/images/icons_android/ic_action_camera_busy.png";
var iconTextShareReady = "/images/icons_android/ic_action_share_ready.png";
var iconTextShareBusy = "/images/icons_android/ic_action_share_busy.png";

function changeButtonIconToReadyForImageAndroid(buttonId) {
	buttonId.backgroundImage = iconCameraReady;
}
function changeButtonIconToBusyForImageAndroid(buttonId) {
	buttonId.backgroundImage = iconCameraBusy;
}
function changeButtonIconToReadyForTextAndroid(buttonId) {
	buttonId.backgroundImage = iconTextShareReady;
}
function changeButtonIconToBusyForTextAndroid(buttonId) {
	buttonId.backgroundImage = iconTextShareBusy;
}


module.exports = androidService;