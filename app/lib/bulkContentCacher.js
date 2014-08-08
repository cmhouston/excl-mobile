var cache = require('remoteDataCache');

exports.cacheMuseum = function (museumJSON) {
	cacheAllMediaInJSON(museumJSON);
	cacheComponentsJSONFromMuseumJSON(museumJSON);
};

function cacheComponentsJSONFromMuseumJSON(museumJSON) {
	_.each(museumJSON.data.museum.exhibits, function(exhibitJSON, index, list) {
		_.each(exhibitJSON.components, function(componentJSON, index, list) {
			var url = getComponentURLFromComponentJSON(componentJSON);
			cache.getText({url: url, onsuccess: function(text, request) {
				Ti.API.info("Success function: " + text);
				cacheAllMediaInJSON(text);
			}});
		});
	});
}

function getComponentURLFromComponentJSON(componentJSON) {
	var url = Alloy.Globals.rootWebServiceUrl + "/component/" + componentJSON.id;
	return url;
}

function cacheAllMediaInJSON(json) {
	json = prepareJSONForRegEx(json);
	var urlExtractor = /https?:\/\/([-\w\.]+)+(:\d+)?(\/([\w\/_\.-]*(\?\S+)?)?)?\.(jpg|png|mp4)(\/([\w\/_\.-]*)?)?/gmi;
	var mediaArray;
	while ((mediaArray = urlExtractor.exec(json)) !== null)
	{
		var url = mediaArray[0];
		Ti.API.info("Caching url: " + url);
		cache.getFile({
			url: url,
			onsuccess: function(path, request) {},
			onerror: function(request) {}
		});
	}
}

function prepareJSONForRegEx(json) {
	if(_.isString(json)) {
		try {
			json = JSON.parse(json);
		} catch(e) {
			json = "";
		}
	}
	return JSON.stringify(json);
}
