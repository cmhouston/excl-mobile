var parseCalls = {

	parse : function(object) {
		var json;
		try {
			json = JSON.parse(object);
		} catch(err) {
			json = false;
		}
		return json;
	},

};

module.exports = parseCalls;
