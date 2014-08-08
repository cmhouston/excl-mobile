var rdc = require('remoteDataCache');

exports.cacheMuseum = function (museumJSON) {
	cacheAllMediaInJSON(museumJSON);
	cacheComponentsJSONFromMuseumJSON(museumJSON);
};

function cacheComponentsJSONFromMuseumJSON(museumJSON) {
	_.each(museumJSON.data.museum.exhibits, function(exhibitJSON, index, list) {
		_.each(exhibitJSON.components, function(componentJSON, index, list) {
			var url = getComponentURLFromComponentJSON(componentJSON);
			rdc.getText({url: url, onsuccess: function(text, request) {
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
	json = JSON.stringify(json);
	var urlExtractor = /https?:\/\/([-\w\.]+)+(:\d+)?(\/([\w/_\.-]*(\?\S+)?)?)?\.(jpg|png|mp4)/gmi;
	var mediaArray;
	while ((mediaArray = urlExtractor.exec(json)) !== null)
	{
		var url = mediaArray[0];
		Ti.API.info("Caching url: " + url);
		rdc.getFile({
			url: url,
			onsuccess: function(path, request) {
			},
			onerror: function(request) {
			}}
		);
	}
}