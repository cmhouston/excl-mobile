# ExCL Developer Documentation #

### Contents ###

1. [Introduction to ExCL](#exclIntro)
- [WordPress](https://github.com/cmhouston/excl-cms#wordpress)
- [Titanium](#titanium)
	1. [Introduction to Titanium](#introToTitanium)
	- Running the Unit Tests 				(MN)
	- [Running the ExCL App](#runningExCL)
		1. Android
		- iOS
	- [Debugging](#debugging)				(KC/GK/SF)
		1. Android
		- iOS 
	- [Code Overview](#codeOverview)
		1. Navigation Controller 			(??)
		- Analytics 						(KC)
	- Enhancing the ExCL App 				(GD)
	- TiShadow 								(JY)
	- TroubleShooting						(All)
- Buildbox for Continuous Integration 		(SF)
- [Deploying to the App Store](#appStore)	(AP)
	1. Apple
	- Google Play

# <a name="exclIntro"></a> Introduction to ExCL #
ExCL is a platform that enables museums to engage visitors at museum activities through the use of a mobile application. Content is managed through a WordPress content management system by museum staff, and visitors will download the customized ExCL app, written using [Appcelerator Titanium](http://www.appcelerator.com/titanium/), to their mobile device. ExCL is also intended to be used by museums on kiosk devices and provides a kiosk mode for this purpose.

ExCL is divided into two parts: the content management system and the Appcelerator Titanium mobile application. This repository is for the Titanium mobile application. If you're interested in the content management side, click here to go to the [Wordpress project](https://github.com/cmhouston/excl-cms).

This documentation is intended for ExCL developers and details the steps to setup and enhance the mobile application. We will describe the Titanium technical details, followed by tips on using a continuous integration build server and deploying to the app stores.

# <a name="titanium"></a>Titanium #

## <a name="introToTitanium"></a> Introduction to Titanium ##

Titanium is a tool that allows developers to create applications for multiple platforms using a single project. For this project we are using Titanium in order to support both iOS and Android operating systems. 

Appcelerator provides many useful features and examples, which can be found under the [Titanium SDK Documentation](http://docs.appcelerator.com/titanium/3.0/) 

## <a name="gettingStarted"></a> Getting started ##

### Install Titanium Studio ###

Titanium Studio is an Eclipse base IDE used for developing Titanium projects. Appcelerator allows developers to [download Titanium Studio](http://www.appcelerator.com/titanium/) for free after setting  up an account.

### Import ExCL to Titanium Studio ###

In order to view and edit the ExCL project using Titanium studio the project must be retrieved from github. Open a command prompt, navigate to a desired folder run the following command:

	$ git clone https://github.com/cmhouston/excl-mobile.git

After the project has been downloaded to your local system execute the following steps to access it through your IDE

1. Open Titanium Studio and go to File->Import
2. Select Titanium->Existing Mobile Project and click next
3. Browse your local file system and choose the folder you cloned from github
4. Set your desired project name and click finish

The run option at the top left of the screen is by default unavailable. To enable this button execute the following steps:

1. Right click on the project in your Project Explorer and open up the Properties
- Click on Project Natures
- Select Mobile and make it the Primary nature
- Click OK

## Running The Unit Tests ##

## <a name="#runningExCL"></a> Running the ExCL Application ##

### Android ###

#### GenyMotion Emulator ####

#### Android Device ####

### iOS ###

#### iOS Emulator ####

#### iOS Device ####

## <a name="debugging"></a> Debugging ##

## <a name="codeOverview"></a> Code Overview ##

## Enhancing the ExCL App ##

## Ti Shadow ##

## TroubleShooting ##

# BuildBox for Continuous Integration #

# <a name="appStore"></a> Deploying to the App Store #


_______
### Lib Docs ###

* [Navigation Controller](/docs/NavigationController.md)
* [Custom Calls API](/docs/CustomCalls.md)
* [Installing Unit Testing & Code Coverage Tools](/docs/installingUnitTestingAndCodeCoverageTools.md)
* [How to Debug on Genymotion](/docs/debuggingOnGenymotion.md)
