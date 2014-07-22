Using the NavigationController
=============================

* Instantiate singleton controller in alloy.js with: 

	`var NavigationController = require('NavigationController');
	 Alloy.Globals.navController = new NavigationController();`
	
	
* Open new windows with:

	`var controller = Alloy.createController('yourControllerNameHere');`
	`Alloy.Globals.navController.open(controller);`
	 
	 
* If you want to add the kiosk mode listener to an element on your page, use:

	`Alloy.Globals.navController.addKioskModeListener($.yourHomeButtonId);`
	
	
* To access kiosk mode status, use:

	`Alloy.Globals.navController.isInKioskMode()`
	
	
* If you need to make changes on your page on entering or exiting kiosk mode, define some functions in your controller and assign them like so:

	`$.onEnterKioskMode = function(view){/*your code here*/};`
	`$.onExitKioskMode = function(view){/*your code here*/};`

	These functions will automatically be picked up when you call:

	`Alloy.Globals.navController.open(controller);`
	
* Finally, to navigate home, you can call:

	`Alloy.Globals.navController.home();`
	  
	