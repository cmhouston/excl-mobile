Using the NavigationController
=============================

* Instantiate singleton controller in alloy.js with: 

	```html
		var NavigationController = require('NavigationController');
		Alloy.Globals.navController = new NavigationController();
	```
	
	
* Open new windows with:

	```html
	var controller = Alloy.createController('yourControllerNameHere');
	Alloy.Globals.navController.open(controller);
	```

	
* To navigate home, you can call:

	```html
	Alloy.Globals.navController.home();
	```
	  
	