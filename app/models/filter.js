exports.definition = {
	config: {
		defaults: {
			name: "filter name",
			active: false
		},
		adapter: {
			type: "properties",
			collection_name: "filter"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
			ready: false
		});

		return Collection;
	}
};