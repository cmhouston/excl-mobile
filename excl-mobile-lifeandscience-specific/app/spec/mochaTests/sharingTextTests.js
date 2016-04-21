var sharingTextService = require('../../lib/sharing/sharingTextService');
var sharingTextService = new sharingTextService();
var buttonService = require('../../lib/customCalls/buttonService');
var iconService = require('../../lib/customCalls/iconService');
var intentService = require('../../lib/customCalls/intentService');
var assert = require("assert");
var sinon = require("sinon");

describe('sharingTextService', function(){
	
	describe("getPostTags", function() {
		it("should return social media message from json", function() {
			var dataToSend = [];
			dataToSend.social_media_message = 'Test social media message';
			var expectedData = 'Test social media message';
			
			var returnedData = sharingTextService.getPostTags(dataToSend);
			assert.equal(returnedData, expectedData);
		});
	});
	
	describe("setPathForLibDirectory", function(){ //Don't think I can test the other branch, since the purpose of this function is to accommodate unit testing
		it("should return the correct library for unit testing", function(){
			var dataToSend = "customCalls/apiCalls";
			var expectedData = require("../../lib/customCalls/apiCalls");
			
			var returnedData = sharingTextService.setPathForLibDirectory(dataToSend);
			assert.equal(returnedData, expectedData);
		});
	});
	
	describe("setIconReady", function(){
		it("should set the enabled property of the button to true for Android", function(){
			var dataToSend = [];
			var expectedData = [];
			OS_ANDROID = true;
			expectedData.enabled = true;
			
			sharingTextService.setIconReady(dataToSend);
			assert.equal(dataToSend.enabled, expectedData.enabled);
		});
		
		it("should set the enabled property of the button to true for iOS", function(){
			var dataToSend = [];
			var expectedData = [];
			OS_ANDROID = false;
			OS_IOS = true;
			expectedData.enabled = true;
			
			sharingTextService.setIconReady(dataToSend);
			assert.equal(dataToSend.enabled, expectedData.enabled);
		});
		
		it("should set the correct Android ready button", function(){
			var dataToSend = [];
			OS_ANDROID = true;
			
			var expectedData = [];
			expectedData.backgroundImage = "/images/icons_android/share_ready.png";
			
			sharingTextService.setIconReady(dataToSend);
			assert.equal(dataToSend.backgroundImage, expectedData.backgroundImage);
		});
		
		it("should set the correct iOS ready button", function(){
			var dataToSend = [];
			OS_ANDROID = false;
			OS_IOS = true;
			
			var expectedData = [];
			expectedData.backgroundImage = "images/icons_ios/share_ready.png";
			
			sharingTextService.setIconReady(dataToSend);
			assert.equal(dataToSend.backgroundImage, expectedData.backgroundImage);
		});
	});

	describe("setIconBusy", function(){
		it("should set the enabled property of the button to false for Android", function(){
			var dataToSend = [];
			var expectedData = [];
			OS_ANDROID = true;
			expectedData.enabled = false;
			
			sharingTextService.setIconBusy(dataToSend);
			assert.equal(dataToSend.enabled, expectedData.enabled);
		});
		
		it("should set the enabled property of the button to false for iOS", function(){
			var dataToSend = [];
			var expectedData = [];
			OS_ANDROID = false;
			OS_IOS = true;
			expectedData.enabled = false;
			
			sharingTextService.setIconBusy(dataToSend);
			assert.equal(dataToSend.enabled, expectedData.enabled);
		});
		
		it("should set the correct Android busy button", function(){
			var dataToSend = [];
			OS_ANDROID = true;
			
			var expectedData = [];
			expectedData.backgroundImage = "/images/icons_android/share_busy.png";
			
			sharingTextService.setIconBusy(dataToSend);
			assert.equal(dataToSend.backgroundImage, expectedData.backgroundImage);
		});
		
		it("should set the correct iOS busy button", function(){
			var dataToSend = [];
			OS_ANDROID = false;
			OS_IOS = true;
			
			var expectedData = [];
			expectedData.backgroundImage = "images/icons_ios/share_busy.png";
			
			sharingTextService.setIconBusy(dataToSend);
			assert.equal(dataToSend.backgroundImage, expectedData.backgroundImage);
		});
	});
	
	describe("initiateIntentText", function(){
		it("should set the button to enabled", function(){
			var dataToSendPostTags = "";
			OS_ANDROID = true;
			var dataToSendButton = [];
			
			var fakeIntentService = {
				sendIntentTextAndroid: function(){},
				sendIntentTextiOS: function(){}
			};
			sharingTextService.setIntentService(fakeIntentService);
			sharingTextService.initiateIntentText(dataToSendPostTags, dataToSendButton);
			assert.equal(dataToSendButton.enabled, true);
		});
		
		it("should call sendIntentTextAndroid if OS_ANDROID", function(){
			var dataToSendPostTags = "";
			OS_ANDROID = true;
			var dataToSendButton = [];
			
			var fakeIntentService = {
				sendIntentTextAndroid: function(){},
				sendIntentTextiOS: function(){}
			};
			var sendIntentTextAndroidSpy = sinon.spy(fakeIntentService, 'sendIntentTextAndroid');
			var sendIntentTextiOSSpy = sinon.spy(fakeIntentService, 'sendIntentTextiOS');
			sharingTextService.setIntentService(fakeIntentService);
			sharingTextService.initiateIntentText(dataToSendPostTags, dataToSendButton);
			assert(sendIntentTextAndroidSpy.calledOnce);
			assert.equal(sendIntentTextiOSSpy.called, false);
		});
		
		it("should call sendIntentTextiOS if OS_IOS", function(){
			var dataToSendPostTags = "";
			OS_ANDROID = false;
			OS_IOS = true;
			var dataToSendButton = [];
			
			var fakeIntentService = {
				sendIntentTextAndroid: function(){},
				sendIntentTextiOS: function(){}
			};
			var sendIntentTextAndroidSpy = sinon.spy(fakeIntentService, 'sendIntentTextAndroid');
			var sendIntentTextiOSSpy = sinon.spy(fakeIntentService, 'sendIntentTextiOS');
			sharingTextService.setIntentService(fakeIntentService);
			sharingTextService.initiateIntentText(dataToSendPostTags, dataToSendButton);
			assert(sendIntentTextiOSSpy.calledOnce);
			assert.equal(sendIntentTextAndroidSpy.called, false);
		});
	});
	
	describe("setIntentService", function(){
		it("should set and get the intent service properly", function(){
			fakeIntentService = sinon.spy();
			sharingTextService.setIntentService(fakeIntentService);
			assert.equal(fakeIntentService, sharingTextService.getIntentService());
		});
	});

/*
	describe("initiateTextShareButton", function(){
		it("should call createButton", function(){
			var dataToSend = [];
			OS_ANDROID = true;
			
			var fakeButtonService = {
				createButton: function(){ return []; },
				eraseButtonTitleIfBackgroundPresent: function(){},
				setButtonEnabled: function(){}
			};
			var createButtonSpy = sinon.spy(fakeButtonService, 'createButton');
			sharingTextService.setButtonService(fakeButtonService);
			
			var fakeIntentService = {
				sendIntentTextAndroid: function(){},
				sendIntentTextiOS: function(){}
			};
			var sendIntentTextAndroidSpy = sinon.spy(fakeIntentService, 'sendIntentTextAndroid');
			sharingTextService.setIntentService(fakeIntentService);
			
			var setClickListenerStub = sinon.stub();
				
			sharingTextService.initiateTextShareButton(dataToSend);
			
			assert(createButtonSpy.calledOnce);
		});
	});
	*/
	
});

