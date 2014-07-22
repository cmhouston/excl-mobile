exports.definition = {
	config: {
		defaults: {
			customizeLearningEnabled: false,
			customizeLearningSet: false,
			currentLanguage: Titanium.Locale.getCurrentLocale().substr(0,2),
			tutorialOn: true
		},
		adapter: {
			type: "properties",
			collection_name: "app"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
			
			retrieveMuseumData: function() {
				var retriever = Alloy.Globals.setPathForLibDirectory('dataRetriever/dataRetriever');
				var url = Alloy.Globals.rootWebServiceUrl;
	
				retriever.fetchDataFromUrl(url, function(response) {
					if(response) {
						Alloy.Globals.museumJSON = response;
						
						var filters = response.data.museum.tailored_content_categories;
						filters = filters.split('|');
						
						for(var i = 0; i < filters.length; i++) {
							var filterName = filters[i];
							filter = {
								name: filterName,
								active: false
							};
							Alloy.Collections.filter.add(filter);
						}
						filters = Alloy.Collections.filter;
						
						for(var i = 0; i < filters.size(); ++i) {
							filters.at(i).on('change:active', function(e) {
								Alloy.Models.app.trigger('change:customizeLearningEnabled');
							});
						};
						Alloy.Collections.filter.ready = true;
					}
				});
			},
			
			// more app member functions go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});

		return Collection;
	}
};