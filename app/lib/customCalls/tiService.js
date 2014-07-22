var tiService = {
	App: {
		Properties : {
			setBool: function(key, bool) {
				Titanium.App.Properties.setBool(key, bool);
			},
			getBool: function(key) {
				return Titanium.App.Properties.getBool(key);
			},
			setString: function(key, string) {
				Titanium.App.Properties.setString(key, string);
			},
			getString: function(key) {
				return Titanium.App.Properties.getString(key);
			}
		}
	}
};

module.exports = tiService;
