// titanium on iOS has a bug with big integers in sqlite (see https://jira.appcelerator.org/browse/TIMOB-3050)
// that's why timeRetrieved is a text field, and the model's save and collection's fetch methods are overridden
// to convert the timestamp to string for saving in the database and back to int when retrieving from the database.

exports.definition = {
	config: {
		columns: {
		    "url": "text",
		    "text": "text",
		    "timeRetrieved": "text"
		},
		adapter: {
			type: "sql",
			collection_name: "rdcResponseText"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
			save: function(attrs, options) {
				if(attrs['timeRetrieved'] != undefined) {
					attrs['timeRetrieved'] = attrs['timeRetrieved'] + '';
				}
				return Backbone.Model.prototype.save.call(this, attrs, options);
			}
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
			fetch: function(attrs) {
				Backbone.Collection.prototype.fetch.apply(this, arguments);
				this.each(function(rdcResponse){
					if(rdcResponse.attributes['timeRetrieved'] != undefined) {
						rdcResponse.attributes['timeRetrieved'] = parseInt(rdcResponse.attributes['timeRetrieved']);
					}
				});
			}
		});

		return Collection;
	}
};