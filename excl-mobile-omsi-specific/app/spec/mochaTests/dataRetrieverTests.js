var dataRetriever = require('../../lib/dataRetriever/dataRetriever');
var apiCalls = require('../../lib/customCalls/apiCalls');
var networkCalls = require('../../lib/customCalls/networkCalls');
var parseCalls = require('../../lib/customCalls/parseCalls');
var assert = require("assert");
var sinon = require("sinon");

describe('parsedJson', function(){
	describe("parse", function() {
		it("should return 'parsed' json data", function() {

			var dataToSend = "\"social-media-settings\": {\"liking\": true,\"sharing\": false,\"commenting\": true},";
			var expectedData = "\"social-media-settings\": {\"liking\":expectedData true,\"sharing\": false,\"commenting\": true},";
			
			var stub = sinon.stub(parseCalls, "parse");
			stub.returns(expectedData);
			var returnedData = dataRetriever.parseJson(dataToSend);
			assert.equal(returnedData, expectedData);
		});
	});
});

describe("fetchDataFromUrl", function(){
	describe("network", function(){
		it("should call open and send methods", function(){
			var stub = sinon.stub(networkCalls, "network");
			var openFunctionCalled, sendFunctionCalled = false;
			var url = "http://api.openweathermap.org/data/2.5/weather?q=Houston,us&mode=json&units=imperial";
			stub.returns({
				open : function() {
					openFunctionCalled = true;
				},
				send : function() {
					sendFunctionCalled = true;
				},
			});
			dataRetriever.fetchDataFromUrl(url);
			assert.equal(openFunctionCalled, true);
			assert.equal(sendFunctionCalled, true);
		});
	});
});

