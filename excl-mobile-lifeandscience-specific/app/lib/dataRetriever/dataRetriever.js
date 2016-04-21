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

var apiCalls, networkCalls, parseCalls, alloyCalls;
var cache = require('remoteDataCache');

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
	
	cache.getText({
		url: url,
		onsuccess: function(responseText, request) {
			if(onSuccess && typeof onSuccess === 'function') onSuccess(JSON.parse(responseText));
		}
	});
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
		client.open("POST", url);//, false);
		client.send(JSON.stringify(jsonData));
	}

}

var rootPath = (typeof Titanium == 'undefined')? '../../lib/customCalls/' : 'customCalls/';
setPathForLibDirectory(rootPath);
module.exports.parseJson = parseJson;
module.exports.fetchDataFromUrl = fetchDataFromUrl;
module.exports.sendJsonToUrl = sendJsonToUrl;
module.exports.checkIfDataRetrieverNull = checkIfDataRetrieverNull;
