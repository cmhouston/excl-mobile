# ExCL Developer Documentation #

### Contents ###

1. [Introduction to ExCL](#exclIntro)
- [WordPress]()
- [Titanium](#titanium)
	1. Introduction to Titanium
	- Installing Titanium Studio
	- Build Process
		1. Walkthrough
		- Issues We've Run Into
	- Running the Unit Tests
	- Running the ExCL App
	- Code Overview
		1. Navigation Controller
		- Analytics
	- Enhancing the ExCL App
	- TiShadow
- Buildbox for Continuous Integration
- Deploying to the App Store
	1. Apple
	- Google Play


# <a name="exclIntro"></a>Introduction to ExCL #
ExCL is a platform that enables museums to engage visitors at museum activities through the use of 
a mobile application. Content is managed through a WordPress content management system by museum 
staff, and visitors will download the customized ExCL app, written using Appcelerator’s Titanium, 
to their mobile device. ExCL is also intended to be used by museums on kiosk devices and provides 
a kiosk mode for this purpose.

This documentation is intended for ExCL developers and details the steps to setup and enhance both 
the content management system and the mobile application. We will describe both the WordPress and 
the Titanium technical details, followed by tips on using a continuous integration build server and 
deploying to the app stores.

For the WordPress developer documentation, please go [here]()

For the Titanium developer documentation, please go [here]()

## <a name="titanium"></a>Titanium ##

### Getting started ###

1. Clone the repository to your computer
2. Open up Titanium Studio and Import the existing project into your workspace
3. Develop

### Lib Docs ###

* [Navigation Controller](/docs/NavigationController.md)

* [Custom Calls API](/docs/CustomCalls.md)

* [Installing Unit Testing & Code Coverage Tools](/docs/installingUnitTestingAndCodeCoverageTools.md)

* [How to Debug on Genymotion](/docs/debuggingOnGenymotion.md)