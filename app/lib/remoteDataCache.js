// -- exports --
module.exports.getFile = getFile;
module.exports.getText = getText;
module.exports.clear = clear;

// -- exec --
init();

// -- named values --
var FILE = 'rdc.FILE';
var TEXT = 'rdc.TEXT';
var FILE_MODEL = 'rdcResponseData';
var TEXT_MODEL = 'rdcResponseText';
var DAY_IN_MILLISECONDS = 86400000;
var CACHE = 'rdc.CACHE';
var CACHE_VIA_REMOTE_ERROR = 'rdc.CACHE_VIA_REMOTE_ERROR';
var REMOTE_HOST = 'rdc.REMOTE_HOST';
var REQUEST_COMPLETED_EVENT = 'remoteDataCache:requestCompleted';
var DOWNLOADING_EVENT = 'remoteDataCache:downloading';

// -- private attributes --
var requestStack, downloading;

// -- public attributes (exports) --

// -- private functions --
function init() {
	requestStack = [];
	downloading = false;
	Ti.App.addEventListener(REQUEST_COMPLETED_EVENT, function(request) {
		Ti.API.info(REQUEST_COMPLETED_EVENT + ' ' + request);
		var downloaded = request.responder === REMOTE_HOST || request.responder === CACHE_VIA_REMOTE_ERROR;
		if(downloaded && requestStack.length > 0) download(requestStack.pop());
		else downloading = false;
	});
	// Ti.App.addEventListener(DOWNLOADING_EVENT, function(e) {
		// Ti.API.info(DOWNLOADING_EVENT + ' ' + e);
	// });
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
	Ti.API.error('remoteDataCache.error ' + JSON.stringify(request));
	Ti.App.fireEvent(REQUEST_COMPLETED_EVENT, request);
	if(request.onerror && typeof request.onerror === 'function') request.onerror();
};

function submit(request) {
	var cachedResponses = getCachedResponses(request);
	if(isCached(request, cachedResponses)) {
		var cachedResponse = cachedResponses.at(0);
		request.response = cachedResponse;
		if(isRecent(cachedResponse)) {
			var now = new Date();
			request.responseTime = now.getTime() - request.made;
			request.responder = CACHE;
			success(request);
		}
		else stack(request);
	}
	else stack(request);
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
	Ti.API.info('remoteDataCache.success ' + JSON.stringify(request));
	Ti.App.fireEvent(REQUEST_COMPLETED_EVENT, request);
	if(request.onsuccess && typeof request.onsuccess === 'function') request.onsuccess();
};

function stack(request) {
	if(!downloading) {
		downloading = true;
		download(request);
	}
	else requestStack.push(request);
};

function download(request) {
	var cachedResponse = request.response;
	if(!cachedResponse) {
		var modelType = request.type === FILE ? FILE_MODEL : TEXT_MODEL;
		request.response = Alloy.createModel(modelType);
	}
	var client = Ti.Network.createHTTPClient({
		onload: function(e) {
			var now = new Date();
			request.response.save({
				url: request.url,
				timeRetrieved: now.getTime()
			});
			if(request.type === FILE) {
				var file = Ti.Filesystem.createTempFile();
				file.write(this.responseData);
				request.response.save({
					localPath: file.nativePath
				});
			}
			else {
				request.response.save({
					text: this.responseText
				});
			}
			request.responseTime = now.getTime() - request.made;
			request.responder = REMOTE_HOST;
			success(request);
		},
		onerror: function(e) {
			if(cachedResponse) {
				var now = new Date();
				request.responseTime = now.getTime() - request.made;
				request.responder = CACHE_VIA_REMOTE_ERROR;
				success(request);
			}
			else error(request);
		},
		ondatastream: function(e) {
			Ti.App.fireEvent(DOWNLOADING_EVENT, {
				progress: e.progress,
				url: request.url
			});
		}
	});
	client.open('GET', request.url);
	client.send();
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
