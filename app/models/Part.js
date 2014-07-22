exports.definition = {
	config: {
		columns: {
		    "id": "integer",
		    "part_order": "integer",
		    "name": "text",
		    "type": "text",
		    "video": "text",
		    "image": "text",
		    "body": "text",
		    "rich": "text"
		},
		adapter: {
			type: "sql",
			collection_name: "Part",
			idAttribute: "alloy_id"
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