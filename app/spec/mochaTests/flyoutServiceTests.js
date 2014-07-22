var flyoutService = require('../../lib/navigationService/flyoutService');
var assert = require("assert");
var sinon = require("sinon");

describe('Flyout Service', function(){
	var menu;
	var getOpenAnimationStub;
	var getCloseAnimationStub;
	var getMenuStub;
	
	before(function(){			
		menu = {
			animate: function(){}
		};
		getOpenAnimationStub = sinon.stub(flyoutService, 'getOpenAnimation');
		getCloseAnimationStub = sinon.stub(flyoutService, 'getCloseAnimation');
		getMenuStub = sinon.stub(flyoutService, 'getMenu').returns(menu);
	});
	
	describe('closeMenu', function(){
		it('should return false if operated on when kiosk mode is on', function(){	
			var stub = sinon.stub(flyoutService, 'isEnabled').returns(false);	
		
			assert(!flyoutService.closeMenu(), "The menu returned true when asked to close");
			stub.restore();
		});		
	});
	describe('openMenu', function(){
		it('should return false if operated on when kiosk mode is on', function(){	
			var stub = sinon.stub(flyoutService, 'isEnabled').returns(false);		
			assert(!flyoutService.openMenu(), "The menu returned true when asked to open");
			stub.restore();
		});	
		it('should be called when toggleMenu ', function(){	
			var stub = sinon.stub(flyoutService, 'isEnabled').returns(false);		
			assert(!flyoutService.openMenu(), "The menu returned true when asked to open");
			stub.restore();
		});			
	});
	describe('toggleMenu', function(){
		it('should return false if operated on when kiosk mode is on', function(){	
			var stub = sinon.stub(flyoutService, 'isEnabled').returns(false);		
			assert(!flyoutService.toggleMenu(), "The toggle returned true");
			stub.restore();
		});
	});
	describe('getOpenAnimation',function(){
		it('should be called when openMenu is called and kiosk mode is disabled', function(){			
			var stub = sinon.stub(flyoutService, 'isEnabled').returns(true);	
			flyoutService.openMenu();
			assert(getOpenAnimationStub.called, 'was not called when openMenu was called');	
			stub.restore();	
		});
		
	});	
	
	describe('getCloseAnimation',function(){
		it('should be called when closeMenu is called', function(){			
			var stub = sinon.stub(flyoutService, 'isEnabled').returns(true);	
			flyoutService.closeMenu();
			assert(getCloseAnimationStub.called, 'was not called when closeMenu was called');
			stub.restore();	
		});
	});
	
	describe('isEnabled',function(){
		it('should be called when openMenu is called', function(){			
			var stub = sinon.stub(flyoutService, 'isEnabled');
			flyoutService.openMenu();
			assert(stub.called, 'was not called when openMenu was called');
			stub.restore();	
		});
	});
	
	describe('getMenu', function(){
		beforeEach(function(){	
			getMenuStub.restore();		
			menu = {
				animate: function(){}
			};

			//getOpenAnimationStub = sinon.stub(flyoutService, 'getOpenAnimation');
			//getCloseAnimationStub = sinon.stub(flyoutService, 'getCloseAnimation');
			getMenuStub = sinon.stub(flyoutService, 'getMenu').returns(menu);
		});
		
		it('should be called when openMenu is called and Kiosk mode is disabled',function(){
			var stub = sinon.stub(flyoutService, 'isEnabled').returns(true);	
			flyoutService.openMenu();
			assert(getMenuStub.called, 'was not called when Kiosk mode was disabled');
			stub.restore();		
		});		
		it('should not be called when openMenu is called and Kiosk mode is enabled',function(){
			var stub = sinon.stub(flyoutService, 'isEnabled').returns(false);	
			flyoutService.openMenu();
			assert(!getMenuStub.called, 'was called when Kiosk mode was enabled');
			stub.restore();	
		});
		it('should be called when closedMenu is called',function(){
			flyoutService.closeMenu();
			assert(getMenuStub.called, 'was not called');
		});
		it('should be called when toggleMenu is called and Kiosk mode is disabled',function(){
			var stub = sinon.stub(flyoutService, 'isEnabled').returns(true);	
			flyoutService.openMenu();
			assert(getMenuStub.called, 'was not called');
			stub.restore();	
		});
	});
	
	after(function(){
		getOpenAnimationStub.restore();
		getCloseAnimationStub.restore();
		getMenuStub.restore();
	});
});