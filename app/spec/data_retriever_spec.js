var dataRetriever = require('../lib/dataRetriever/dataRetriever');
var apiCalls = require('../lib/customCalls/apiCalls');
var networkCalls = require('../lib/customCalls/networkCalls');
var parseCalls = require('../lib/customCalls/parseCalls');

describe("Testing parsedJson", function() {
	it("should return 'parsed' json data", function() {
		// Arrange
		var dataToSend = "\"social-media-settings\": {\"liking\": true,\"sharing\": false,\"commenting\": true},";
		var expectedData = "\"social-media-settings\": {\"liking\":expectedData true,\"sharing\": false,\"commenting\": true},";
		spyOn(parseCalls, 'parse').andReturn(expectedData);

		// Act
		var returnedData = dataRetriever.parseJson(dataToSend);

		// Assert
		expect(returnedData).toBe(expectedData);
	});
});

describe("Testing network", function() {
	it("should return valid http client", function() {
		// Arrange
		var url = "http://api.openweathermap.org/data/2.5/weather?q=Houston,us&mode=json&units=imperial";
		var openFunctionCalled, sendFunctionCalled = false;
		spyOn(networkCalls, 'network').andReturn({
			open : function() {
				openFunctionCalled = true;
			},
			send : function() {
				sendFunctionCalled = true;
			},
		});

		// Act
		dataRetriever.fetchDataFromUrl(url);

		// Assert
		expect(openFunctionCalled).toBe(true);
		expect(sendFunctionCalled).toBe(true);

	});
});

