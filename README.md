# Introduction to ExCL #
ExCL is a platform that enables museums to engage visitors at museum activities through the use of 
a mobile application. Content is managed through a WordPress content management system by museum staff, and visitors will download the customized ExCL app, written using [Appcelerator Titanium](http://www.appcelerator.com/titanium/), to their mobile device. ExCL is also intended to be used by museums on kiosk devices and provides a kiosk mode for this purpose.

ExCL is divided into two parts: the content management system and the Appcelerator Titanium mobile application. This repository is for the Titanium mobile application. [Click here to go to the Titanium project](https://github.com/cmhouston/excl-mobile).

This documentation is intended for ExCL developers and details the steps to setup and enhance the mobile application. We will describe the Titanium technical details, followed by tips on using a continuous integration build server and deploying to the app stores.

This documentation is intended for ExCL developers and details the steps to setup and enhance both 
the content management system and the mobile application. We will describe both the WordPress and 
the Titanium technical details, followed by tips on using a continuous integration build server and 
deploying to the app stores.

For the WordPress developer documentation, please go [here]()

For the Titanium developer documentation, please go [here]()

## ExCL Mobile Application ##

### Getting started ###

1. Clone the repository to your computer
2. Open up Titanium Studio and Import the existing project into your workspace

[Push Checklist](/docs/Checkin%20Checklist.md)

### Lib Docs ###

* [Navigation Controller](/docs/NavigationController.md)
* [Custom Calls API](/docs/CustomCalls.md)
* [Installing Unit Testing & Code Coverage Tools](/docs/installingUnitTestingAndCodeCoverageTools.md)
* [How to Debug on Genymotion](/docs/debuggingOnGenymotion.md)
