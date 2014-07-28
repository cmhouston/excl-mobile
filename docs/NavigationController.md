Using the NavigationController
=============================

* Instantiate singleton controller in alloy.js with: 

	`var NavigationController = require('NavigationController');
	 Alloy.Globals.navController = new NavigationController();`
	
	
* Open new windows with:

	`var controller = Alloy.createController('yourControllerNameHere');`
	`Alloy.Globals.navController.open(controller);`

	
* To navigate home, you can call:

	`Alloy.Globals.navController.home();`
	  
	