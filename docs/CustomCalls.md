Using the customCalls API
===========================
  
  
Instead of using Titanium native calls like 'Ti.API.info(someObject)', use the custom API so that it's easier to mock out all the titanium calls, and that makes unit testing a lot easier!
  
  
Example:
```html
var apiLib = Alloy.Globals.setPathForLibDirectory('../lib/customCalls/apiCalls');
var apiCalls = new apiLib();
var networkLib = require('../lib/customCalls/networkCalls');
var networkCalls = new apiLib();
var parseLib = require('../lib/customCalls/parseCalls');
var parseCalls = new parseLib();
```
Instead of
```html
Ti.API.info(someobject);
```
use:
```html
apiCalls.info(someobject);
```
  
To use iconService:
The purpose of this service is to set the backgroundImage of a button to a platform-specific icon. iconService assumes that iOS and Android icons are placed in the images/icons_ios and images/icons_android folder respectively, with identical file names. To use iconService, create an instance of the service as shown above, and then call:
```html
iconService.setIcon(button, filename);
```
where button is the button whose imageBackground property should be set, and the filename is the filename of the desired image.
  
Checkout 'apiCalls.js', 'networkCalls.js', and 'parseCalls.js' (under lib/customCalls) to see which Titanium calls are ready to be mocked out.