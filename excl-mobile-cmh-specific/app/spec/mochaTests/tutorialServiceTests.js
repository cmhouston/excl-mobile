var assert = require("assert");
var sinon = require("sinon");

var TutorialService = require('../../lib/tutorialService/tutorialService');
var alloyService = require('../../lib/customCalls/alloyService');

describe('Tutorial Service', function(){
	describe("openTutorial", function() {
		var tutorialService;
		before(function() {
			var fakeNavController = {
				toggleMenu: function(){}
			};
			var toggleMenuSpy = sinon.spy(fakeNavController, "toggleMenu");
			//tutorialService = new TutorialService();
		});
		it("should close the menu if it's open", function() {
			
		});
		it("should go to the home page", function() {
			
		});
		it("should add the tutorial view to the current window", function() {
			
		});
	});
	
	// describe('#tutorialService', function() {
		// it("should begin with tutorial turned on", function(){
			// var tutorialService = new TutorialService();
			// assert(tutorial.getEnabled());
		// });
		// it("should call the persistance API to get the tutorial's enabled setting", function() {
// 			
			// var fakePersistenceService = {
// 				
			// };
			// var persistenceQuerySpy = sinon.spy(fakePersistenceService, 'getProperty');
			// tutorialService.setPersistenceService(fakePersistenceService);
			// var tutorialService = new TutorialService(fakePersistenceService);
			// assert(persistenceQuerySpy.calledWith("tutorialEnabled"));
		// });
	// });
});