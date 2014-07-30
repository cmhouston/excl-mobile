function openInBrowser(link) {
	Ti.App.fireEvent('app:openInBrowser', link);
}

function changeLinksToOpenInBrowser() {
var aTags = document.getElementsByTagName('a');
for (var i = 0; i < aTags.length; i++) {
	var tag = aTags[i];
	var linkURL = tag.href;
	tag.setAttribute('href', '#');
	tag.setAttribute('onclick', 'openInBrowser(\"' + linkURL + '\"); return false;');
}
}
window.onload = changeLinksToOpenInBrowser;