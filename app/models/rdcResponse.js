exports.definition = {
	config: {
		defaults: {
			source: null,
			text: null,
			accessed: null
		},
		columns: {
		    "source": "UNIQUE TEXT",
		    "text": "TEXT",
		    "accessed": "INTEGER"
		},
		adapter: {
			type: "sql",
			collection_name: "rdcResponse"
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