exports.definition = {
	config: {
		columns: {
		    "id": "integer",
		    "component_order": "integer",
		    "name": "text",
		    "exhibit": "text"
		},
		adapter: {
			type: "sql",
			collection_name: "Component",
			idAttribute: "alloy_id"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
			getScreenName: function() {
				return this.get("exhibit") + "/" + this.get("name");
			},
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
			model: "Component"
		});

		return Collection;
	}
};