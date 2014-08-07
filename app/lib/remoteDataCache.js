// -- exports --
module.exports.getFile = getFile;
module.exports.getText = getText;
module.exports.clear = clear;

// -- exec --
init();

// -- named values --
var FILE = 'rdc.FILE';
var TEXT = 'rdc.TEXT';
var DOWNLOADING_EVENT = 'remoteDataCache:downloading';
var FILE_MODEL = 'rdcResponseData';
var TEXT_MODEL = 'rdcResponseText';
var DAY_IN_MILLISECONDS = 86400000;
var CACHE = 'rdc.CACHE';
var REMOTE_HOST = 'rdc.REMOTE_HOST';

var REQUEST_COMPLETED_EVENT = 'remoteDataCache:requestCompleted';



// -- private attributes --
var downloadStack;

// -- public attributes (exports) --

// -- private functions --
function init() {
	downloadStack = [];
};

function constructRequest(type, url, onload, onerror) {
	var request = {
		type: type,
		made: (new Date()).getTime(),
		url: url,
		responder: null,
		responseTime: null,
		onload: onload,
		onerror: onerror,
		response: null
	};
	return request;
};

function error(request) {
	Ti.API.error('remoteDataCache.error: ' + JSON.stringify(request));
	if(request.onerror && typeof request.onerror === 'function') request.onerror();
};

function submit(request) {
	var cachedResponses = getCachedResponses(request);
	if(isCached(request, cachedResponses)) {
		var cachedResponse = cachedResponses.at(0);
		if(isRecent(cachedResponse) || !Ti.Network.online) {
			request.response = cachedResponse;
			var now = new Date();
			request.responseTime = now.getTime() - request.made;
			request.responder = CACHE;
			success(request);
		}
		else download(request);
	}
	else download(request);
};

function getCachedResponses(request) {
	var modelType = request.type === FILE ? FILE_MODEL : TEXT_MODEL;
	var responses = Alloy.createCollection(modelType);
	var table = responses.config.adapter.collection_name;
	responses.fetch({
		query: 'select * from ' + table + ' where url = "' + request.url + '"'
	});
	return responses;
};

function isCached(request, cachedResponses) {
	if(cachedResponses.length === 0) return false;
	else if (request.type === FILE) {
		var response = cachedResponses.at(0);
		var file = Ti.Filesystem.getFile(response.get('localPath'));
		if(file.exists()) return true;
		else {
			response.destroy();
			return false;
		}
	}
	else return true;
};

function isRecent(response) {
	var now = new Date();
	var delta = now.getTime() - response.get('timeRetrieved');
	return delta < (DAY_IN_MILLISECONDS / 3) ? true : false;
};

function success(request) {
	Ti.API.info('success ' + JSON.stringify(request));
};

function download(request) {
	Ti.API.info('download ' + JSON.stringify(request));
};

function clearCachedResponses(requestType) {
	var modelType = requestType === FILE ? FILE_MODEL : TEXT_MODEL;
	var responses = Alloy.createCollection(modelType);
	var table = responses.config.adapter.collection_name;
	responses.fetch({
		query: 'select * from ' + table
	});
	var wrappedResponses = [];
	responses.each(function(response) {
		wrappedResponses.push({
			 response: response
		 });
	});
	for(var i = 0; i < wrappedResponses.length; ++i) wrappedResponses[i].response.destroy();
};

// -- public functions (exports) --
function getFile(args) {
	if(!args) {
		Ti.API.error('remoteDataCache.getFile: arguments expected');
	}
	else if(!args.url) {
		Ti.API.error('remoteDataCache.getFile: url argument expected');
		var request = constructRequest(null, null, null, args.onerror);
		error(request);
	}
	else {
		var request = constructRequest(FILE, args.url, args.onload, args.onerror);
		submit(request);
	}
};

function getText(args) {
	if(!args) {
		Ti.API.error('remoteDataCache.getText: arguments expected');
	}
	else if(!args.url) {
		Ti.API.error('remoteDataCache.getText: url argument expected');
		var request = constructRequest(null, null, null, args.onerror);
		error(request);
	}
	else {
		var request = constructRequest(TEXT, args.url, args.onload, args.onerror);
		submit(request);
	}
};

function isFileCached(url) {
	var request = constructRequest(FILE, url, null, null);
	var cachedResponses = getCachedResponses(request);
	return isCached(request, cachedResponses);
};

function isTextCached(url) {
	var request = constructRequest(TEXT, url, null, null);
	var cachedResponses = getCachedResponses(request);
	return isCached(request, cachedResponses);
};

function clear() {
	clearCachedResponses(FILE);
	clearCachedResponses(TEXT);
};
