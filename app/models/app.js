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
			
			start: function() {
				Alloy.Models.app.retrieveMuseumData( function() {
					var NavigationController = require('navigationService/NavigationController');
					Alloy.Globals.navController = new NavigationController();
					var home = Alloy.createController('home');
					Alloy.Globals.navController.open(home);
				});
			},
			
			restart: function(callback) {
				Alloy.Models.app.retrieveMuseumData(function() {
					Alloy.Globals.navController.restart(callback);
				});
			},
			
			parseFiltersFromJson: function(json) {
				Alloy.Collections.filter.reset();
				Alloy.Collections.filter.ready = false;
				
				var filters = json.data.museum.tailored_content_categories;
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
			},
			
			retrieveMuseumData: function(callbackWhenDone) {
				var retriever = Alloy.Globals.setPathForLibDirectory('dataRetriever/dataRetriever');
				var url = Alloy.Globals.rootWebServiceUrl;
	
				retriever.fetchDataFromUrl(url, function(response) {
					if(response) {
						Alloy.Globals.museumJSON = response;
						Alloy.Models.app.trigger('museumJsonRetrieved');
						Alloy.Models.app.parseFiltersFromJson(response);
						
						if (callbackWhenDone && typeof(callbackWhenDone) == 'function') {
							callbackWhenDone();
						}
					}
				});
			}

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