exports.definition = {
	config: {
		columns: {
		    "url": "text",
		    "localPath": "text",
		    "timeRetrieved": "integer"
		},
		adapter: {
			type: "sql",
			collection_name: "rdcResponseData"
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
		});

		return Collection;
	}
};