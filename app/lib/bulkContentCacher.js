exports.cacheMuseum = function (museumJSON) {
	cacheAllMediaInJSON(museumJSON);
	cacheComponentsJSONFromMuseumJSON(museumJSON);
};

function cacheComponentsJSONFromMuseumJSON(museumJSON) {
	_.each(museumJSON.data.museum.exhibits, function(exhibitJSON, index, list) {
		_.each(exhibitJSON.components, function(componentJSON, index, list) {
			var url = getComponentURLFromComponentJSON(componentJSON);
			//rdc.getText({url: url, callback: function(json) {
				//cacheAllMediaInJSON(json);
			//}});
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
	  Ti.API.info("Caching url: " + mediaArray[0]);
	}
}