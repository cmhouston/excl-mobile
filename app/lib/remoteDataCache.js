// -- exports --
module.exports.getFile = getFile;
module.exports.getText = getText;
module.exports.clear = clear;

// -- named values --
var FILE = 'rdc.FILE';
var TEXT = 'rdc.TEXT';
var FILE_MODEL = 'rdcResponseData';
var TEXT_MODEL = 'rdcResponseText';
var DAY_IN_MILLISECONDS = 86400000;
var CACHE = 'rdc.CACHE';
var CACHE_VIA_REMOTE_ERROR = 'rdc.CACHE_VIA_REMOTE_ERROR';
var REMOTE_HOST = 'rdc.REMOTE_HOST';
var MIN_PER_HR = 60;
var SEC_PER_MIN = 60;
var MS_PER_SEC = 1000;

// -- exec --
init();

// -- private attributes --
var requestStack, downloading, expiration;

// -- public attributes (exports) --

// -- private functions --
function init() {
	requestStack = [];
	downloading = false;
	expiration = DAY_IN_MILLISECONDS / 3;
};

function constructRequest(type, url, onsuccess, onerror, onstream) {
	var request = {
		type: type,
		made: (new Date()).getTime(),
		url: url,
		responder: null,
		responseTime: null,
		onsuccess: onsuccess,
		onerror: onerror,
		onstream: onstream,
		response: null
	};
	return request;
};

function error(request) {
	Ti.API.error('remoteDataCache.error ' + JSON.stringify(request));
	if(request.onerror && typeof request.onerror === 'function') request.onerror(request);
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
	return delta < expiration ? true : false;
};

function success(request) {
	Ti.API.info('remoteDataCache.success ' + JSON.stringify(request));
	var e = request.type === FILE ? request.response.get('localPath') : request.response.get('text');
	if(request.onsuccess && typeof request.onsuccess === 'function') request.onsuccess(e, request);
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
			if(requestStack.length > 0) download(requestStack.pop());
			else downloading = false;
		},
		onerror: function(e) {
			if(cachedResponse) {
				var now = new Date();
				request.responseTime = now.getTime() - request.made;
				request.responder = CACHE_VIA_REMOTE_ERROR;
				success(request);
			}
			else error(request);
			if(requestStack.length > 0) download(requestStack.pop());
			else downloading = false;
		},
		ondatastream: function(e) {
			stream(request, e.progress);
		}
	});
	client.open('GET', request.url);
	client.send();
};

function stream(request, progress) {
	Ti.API.debug('remoteDataCache.stream ' + JSON.stringify({
		progress: progress,
		request: request
	}));
	if(request.onstream && typeof request.onstream === 'function') request.onstream(progress, request);
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
		var request = constructRequest(null, null, null, args.onerror, null);
		error(request);
	}
	else {
		var request = constructRequest(FILE, args.url, args.onsuccess, args.onerror, args.onstream);
		submit(request);
	}
};

function getText(args) {
	if(!args) {
		Ti.API.error('remoteDataCache.getText: arguments expected');
	}
	else if(!args.url) {
		Ti.API.error('remoteDataCache.getText: url argument expected');
		var request = constructRequest(null, null, null, args.onerror, null);
		error(request);
	}
	else {
		var request = constructRequest(TEXT, args.url, args.onsuccess, args.onerror, args.onstream);
		submit(request);
	}
};

function isFileCached(url) {
	var request = constructRequest(FILE, url, null, null, null);
	var cachedResponses = getCachedResponses(request);
	return isCached(request, cachedResponses);
};

function isTextCached(url) {
	var request = constructRequest(TEXT, url, null, null, null);
	var cachedResponses = getCachedResponses(request);
	return isCached(request, cachedResponses);
};

function clear() {
	clearCachedResponses(FILE);
	clearCachedResponses(TEXT);
};

function setExpiration(hours) {
	if(hours < 0) Ti.API.error('remoteDataCache.setExpiration: argument must be non-negative');
	else expiration = hours * MIN_PER_HR * SEC_PER_MIN * MS_PER_SEC;
};
