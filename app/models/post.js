exports.definition = {
	config: {
		defaults: {
			name: "post name",
			image: "/700x300.png",
			text: "Ipsum whatever and other stuff"
		},
		adapter: {
			type: "properties",
			collection_name: "post"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
			rawJson: {},
			
			getAllComments: function(){
				return this.get('rawJson').comments;
			},
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