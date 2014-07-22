var apiCalls, networkCalls, parseCalls, alloyCalls;

function setPathForLibDirectory(rootPath) {
	apiCalls = require(rootPath + 'apiCalls');
	networkCalls = require(rootPath + 'networkCalls');
	parseCalls = require(rootPath + 'parseCalls');
	alloyCalls = require(rootPath + 'alloyService');
}

function parseJson(responseText) {
	json = parseCalls.parse(responseText);
	return json;
}

function fetchDataFromUrl(url, onSuccess) {
	url = addLanguageToURL(url);
	url = addViewUnpublishedPostsToURL(url);
	
	var client = networkCalls.network(url, onSuccess);
	apiCalls.info("url: " + url);
	if (client) {
		client.open("GET", url, false);
		client.send();
	}
}

function checkIfDataRetrieverNull(returnedData){
	if (!returnedData){
		alert("There was an error retrieving the app's data.\nPlease contact a museum administrator for assistance.");
		Ti.API.info("Error: Connection returned null JSON");
		return true;
	} else {
		Ti.API.info("Connection returned valid JSON");
		return false;
	}
}

function addLanguageToURL(url) {
	var alloyCallsModelApp = alloyCalls.Models.app;
	if (alloyCallsModelApp) {
		url += "?language=" + alloyCallsModelApp.get('currentLanguage');
	}
	return url;
}

function addViewUnpublishedPostsToURL(url){
	if(Alloy.Globals.adminModeController.viewUnpublishedPostsIsEnabled())
	{
		url += "&view_unpublished_posts=" +"true";
	}else
	{
		url += "&view_unpublished_posts=" +"false";
	}
	return url;
}

function sendJsonToUrl(url, jsonData, onSuccess) {
	var client = networkCalls.network(url, onSuccess);

	if (client) {
		client.setRequestHeader("Content-Type", "application/json");
		client.open("POST", url, false);
		client.send(JSON.stringify(jsonData));
	}

}

var rootPath = (typeof Titanium == 'undefined')? '../../lib/customCalls/' : 'customCalls/';
setPathForLibDirectory(rootPath);
module.exports.parseJson = parseJson;
module.exports.fetchDataFromUrl = fetchDataFromUrl;
module.exports.sendJsonToUrl = sendJsonToUrl;
module.exports.checkIfDataRetrieverNull = checkIfDataRetrieverNull;
