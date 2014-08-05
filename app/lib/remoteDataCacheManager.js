// -- exports --
module.exports.request = request;
module.exports.isCached = isCached;
module.exports.clearCache = clearCache;

// -- exec --
init();

// -- named values --
var DAY_IN_MILLISECONDS = 86400000;

// -- private attributes --
var dataDirectory;

// -- public attributes (exports) --

// -- private functions --
function init() {
	if(OS_IOS) dataDirectory = Ti.Filesystem.applicationSupportDirectory + Ti.Filesystem.separator + 'remoteDataCache';
	else if(OS_ANDROID) dataDirectory = Ti.Filesystem.externalStorageDirectory + Ti.Filesystem.seperator + 'remoteDataCache';
	var dataCache = Ti.Filesystem.getFile(dataDirectory);
	if( !dataCache.exists() ) {
		clearCache();
		dataCache.createDirectory();
	}
};

function get(args) {
	var clientArgs = {
		onload: function(e) {
			var now = new Date();
			var rawResponse = {
				source: args.url,
				text: this.responseText,
				data: this.responseData,
				accessed: now.getTime()
			};
			cache(rawResponse);
			requestReady(args);
		},
		onerror: function(e) {
			if( isCached(args.url) ) requestReady(args);
			else requestFailed(args);
		}
	};
	var client = Ti.Network.createHTPPClient(clientArgs);
	if(args.timeout !== null) client.timeout = args.timeout;
	client.open('GET', args.url);
	client.send();
};

function cache(rawResponse) {
	
};

function requestReady(response) {
	Ti.API.info('remoteDataCache: request ready');
	Ti.API.info( JSON.stringify(response) );
	if(args.onReady !== null && typeof args.onReady === 'function') args.onReady(response);
};

function requestFailed(args) {
	Ti.API.info('remoteDataCache: request failed');
	Ti.API.info( JSON.stringify({ url: args.url }) );
	if(args.onFail !== null && typeof args.onFail === 'function') args.onFail({ url: args.url });
};

function isRecentlyCached(response) {
	var now = new Date();
	var delta = now.getTime() - response.accessed;
	var recent = delta < DAY_IN_MILLISECONDS / 3;
	if(recent) return true;
	else return false;
};

function fetchAll(collection) {
	var tableName = responses.config.adapter.collection_name;
	var statement = 'SELECT * from ' + tableName;
	collection.fetch({ query: statement });
};

// -- public functions (exports) --
function request(args) {
	if( !isCached(args.url) ) {
		get(args);
	}
	else {
		var response = Alloy.createModel('rdcResponse');
		response.fetch({ source: args.url });
		if( isRecentlyCached(response) ) requestReady(response);
		else get(args);
	}
};

function isCached(url) {
	var response = Alloy.createModel('rdcResponse');
	response.fetch({ source: url });
	var hasGuid = response.get('alloy_id') !== null;
	var found = hasGuid? true : false;
	if(found) return true;
	else return false;
};

function clearCache() {
	var responses = Alloy.createCollection('rdcResponse');
	fetchAll(responses);
	responses.each(function(response) {
		response.destroy();
	});
	var dataCache = Ti.Filesystem.getFile(dataDirectory);
	if( dataCache.exists() ) dataCache.deleteDirectory(true);
};
