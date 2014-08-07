# ExCL Developer Documentation #

### Contents ###

1. [Introduction to ExCL](#exclIntro)
- [WordPress](https://github.com/cmhouston/excl-cms#wordpress)
- [Titanium](#titanium)
     1. [Introduction to Titanium](#introToTitanium)
     - [Getting Started](#gettingStarted)
     - [Running the ExCL App](#runningExCL)
     - [Debugging](#debugging)
     - [Code Overview](#codeOverview)         
	 - Troubleshooting                                        (All)               
- [Enhancing the ExCL App](#enhancingExCL)            
- TiShadow                                              (LI<JY)
- Distribution For Testing                                 (DH)
- [Unit Testing and Continuous Integration](#unitTestingAndCI)  
- [Deploying to the App Store](#appStore)

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
- Select Titanium->Existing Mobile Project and click next
- Browse your local file system and choose the folder you cloned from github
- Set your desired project name and click finish

The run option at the top left of the screen is by default unavailable. To enable this button execute the following steps:

1. Right click on the project in your Project Explorer and open up the Properties
- Click on Project Natures
- Select Mobile and make it the Primary nature
- Click OK

## <a name="runningExCL"></a> Running the ExCL Application ##

Titanium is designed to easily deploy and simulate projects for multiple platforms. 


### Android GenyMotion Emulator ###

Titanium's built in android emulator is slow and has limited functionality. In order to avoid this issue the ExCL team chose to use the GenyMotion  emulator. Appcelerator provides an article regarding [Using GenyMotion with Titanium 3.2](http://www.appcelerator.com/blog/2013/12/using-genymotion-with-titanium-3-2/)

#### Setting Up GenyMotion on a Mac ####

There are a few more changes that need to be made in order to make GenyMotion compatible with a Mac. Follow these instructions for [How to Set Up GenyMotion on a Mac](docs/howToSetUpGenyMotionOnAMac.md)

### iOS Device Deployment ###

To deploy to an iOS device refer to Appcelerator's documentation on [Deploying to iOS Devices](http://docs.appcelerator.com/titanium/3.0/#!/guide/Deploying_to_iOS_devices)

### Android Device Deployment ###

To deploy to an Android device refer to Appcelerator's documentation on [Deploying to Android Devices](http://docs.appcelerator.com/titanium/3.0/#!/guide/Deploying_to_Android_devices).

If your computer does not recognize your Android device it is also possible to manually install the app.

1. Enable Unknown Sources in the Device's settings app
- Connect the device to the computer via USB
- Build the Application by running it on an Android Emulator
- Navigate to (Project Folder)/build/android/bin on the computer and retrieve the APK file
- Copy this file to the Downloads folder on the device
- Disconnect your device and navigate to the APK file to install

## <a name="debugging"></a> Debugging ##

When using the built in Emulators debugging is very simple. Refer to Appcelerator's documentation for [Debugging on the Emulator or Simulator](http://docs.appcelerator.com/titanium/3.0/#!/guide/Debugging_on_the_Emulator_or_Simulator). When you debug an Alloy project like this one, put your breakpoints in the generated Resources folder's files for best success.

### Debugging on GenyMotion ###

There are a few settings that need to be changed in order to debug on GenyMotion. If you are getting a "no SD card error" then follow these steps in order to resolve the issue:

1. Go to C:\Users\<username>\AppData\Roaming\Titanium\mobilesdk\win32\3.2.3.GA\android\cli\commands
     if on iOS, go to /Users/parivedadeveloper/Library/Application Support/Titanium/mobilesdk/osx/3.2.3.GA/android/cli/commands
- Edit "_build.js"
- Change line 1344 to `} else if (!emu.sdcard && (emu.type !== 'genymotion')) {`

Now try debugging again and the error should be gone

* Adapted from http://stackoverflow.com/questions/21449970/titanium-studio-3-2-0-cannot-debug-using-genymotion-2-0-3e

## <a name="codeOverview"></a> Code Overview ##

### Framework ##

Titanium uses an [MVC Architecture](https://developer.chrome.com/apps/app_frameworks). The Alloy framework holds these files within three separate folders: [models](app/models),  [views](app/views), [controllers](app/controllers). 

ExCL uses an adapted version of the MVC architecture, where much of the logic is found within service files rather than within models. The service files can be can be found within the [lib](app/lib) folder. A couple examples of services used are the [dataRetriever](app/lib/dataRetreiver/dataRetriever.js) and the [sharingImageService](app/lib/sharing/sharingImageService.js).

Alloy allows developers to store global information. in ExCL all global variables are created and exported from [Alloy.js](app/Alloy.js).

Unit testing is another important part of ExCL, and the unit tests can be found in two places.

- Mocha unit tests can be found within the [mochaTests](app/spec/mochaTests) folder, and can be run without compiling the application. (See [Running The Unit Tests](#runningUnitTests) )
- Integration tests can be found withing the [spec](spec) folder and can only be run on a compiled version of the Application. See [Running The Unit Tests](#runningUnitTests)

For more in depth information, refer to Appcelerator's documentation on [Alloy Framework](http://docs.appcelerator.com/titanium/3.0/#!/guide/Alloy_Framework)

### Considerations while using ExCL ###

- All Window Navigation must be done using the [Navigation Controller](/docs/NavigationController.md)
- All fonts and colors are defined Globally within [Alloy.js]()

## Troubleshooting ##

STANDUP

# <a name="enhancingExCL"></a> Enhancing the ExCL App #

At the beginning of the design process, the joint Pariveda and CMH team held a user story workshop, which generated many desired features for the app. The user stories that we didn't get to are listed under the "Could Haves" sprint in our [JIRA account](https://cmhexcl.atlassian.net). There are many other enhancements that are not new features, but instead changes to the current app. Below is a short description of each major area of suggested enhancements.

## UX Enhancements to Current Features ##


A complete list of user stories that we did not get to can be found in this [Google Drive document](https://docs.google.com/spreadsheets/d/1iPPVocjjprG7frXPwPh00Mrh02YqDmYqOXqxRYbju2Q/edit?usp=sharing). The user stories that we decided were possibilities for this summer (everything other than stories rated as "won't") are in [JIRA](https://cmhexcl.atlassian.net), and the stories that haven't been completed yet can be found in the "Could Haves" sprint.

- Extend Tutorial to cover age filtering
- Screen timeout for kiosk mode that resets to the desired home screen
- Allow users to click on images to make them fullscreen, particularly the images on the component landing page and the post landing page
- Save name and e-mail on comment form to device so that users only enter it once
- Make the restart function smoother visually. This function is used for language switching, refreshing the in case of a lost network connection, and restarting the tutorial.
- Make all labels in the app fully customizable from Wordpress
- Allow users to e-mail content to themselves from kiosk mode
- Location tracking using low-energy Bluetooth beacons
- Bookmarking: Users can save suggested activities and view them later
- Allow users to activate built-in tool apps in their phone (stopwatch, calculator, etc.) from the app for relevant activities
- "You May Also Like...": Give users recommendations for other activities to try based on which activity they are currently viewing
- Questions and Results: Ask users questions about the activity they tried, and then display the results of this poll to the user
- Visitor-Generated Content: Allow users to provide content, such as activity recommendations for other users or questions for museum educators
- Allow visitors to earn badges
- Grade-specific recommendations for teachers
- Museum administrators can create surveys and polls to place in the app

## Technical Enhancements ##

- Better error handling for network connection errors
- Refactor the Navigation Controller, as it is complicated and sometimes buggy

## Reporting Bugs ##

Please report all bugs to our [JIRA account](https://cmhexcl.atlassian.net)

## Ti Shadow ##

(LI,JY)















# <a name="unitTestingAndCI"></a> Unit Testing and Continuous Integration #

We recommend using continuous integration to maintain the quality of the product. This repository has several unit tests written using [Mocha](http://visionmedia.github.io/mocha/) and several integration tests using TiShadow's spec format.

Examples of ExCL's unit tests can be found within the project's [spec](app/spec) folder

## Running the Unit Tests ##

In this project, we are using Mocha for unit testing, Istanbul for code coverage and Sinon for mocking.

### Installation ###
The root directory of the project contains a `package.json` file which will install all these tools, and run the unit tests as well.

* Open command prompt, and make sure you are in the root directory of the project folder. Type `npm install` and hit enter. This will install all the tools and will create a folder called `node_modules`. 
* To run the unit tests, you would run `npm test` in the root directory. 
* To add more unit tests, place unit tests .js files under `app/spec/MochaTests`. 
* Istanbul will provide metrics on the command line when you run `npm test`
* A `coverage` folder will be created by Istanbul in the root directory where you will be able to view a html version of the code coverage as well. The html file will be under `coverage/Icov-report`, and once there you can open `index.html`. 

By default the `coverage` and `node_modules` folders won't be committed to the git repo when ever you commit something.

### Further reading ###
* [Mocha Docs](http://visionmedia.github.io/mocha/#assertions) 
* [Sinon Docs (For Mocking)](http://sinonjs.org/docs/)

## Using Buildbox for Continuous Integration ##

The code was designed to use continuous integration. We recommend using [Buildbox](https://buildbox.io) to run a build agent on your local server. Buildbox integrates well with Github or Bitbucket, using hooks to allow Buildbox to automatically trigger builds on your local server. Follow Buildbox's [getting started instructions](https://buildbox.io/docs/guides/getting-started) and create two pipeline tasks to run (1) the unit tests and (2) the integration tests. In the "Script to Run" field, put `scripts/unit.sh` to run the unit tests and `scripts/integration.sh` to run the integration tests. The integration tests do require [TI Shadow](#tiShadow) to be set up.

### Troubleshooting Buildbox ###

Occasionally you will need to change the permissions of the `scripts/unit.sh` and `scripts/integration.sh` scripts to make them executable. These can be found in the `~/.buildbox/{NAME_OF_BUILDBOX_AGENT}/excl-mobile/excl-mobile` directory. You will need to `chmod` those to be executable if you have any problems.

# <a name="appStore"></a> Deploying to the App Store #

Both Google and Apple provide documentation about their app store requirements. These can be found at their developer sites:

- [Android Launch Checklist](http://developer.android.com/distribute/tools/launch-checklist.html)
- [iOS App Store Guidelines](https://developer.apple.com/appstore/resources/approval/guidelines.html)

_______
### Lib Docs ###

* [Navigation Controller](/docs/NavigationController.md)
* [Custom Calls API](/docs/CustomCalls.md)
* [Installing Unit Testing & Code Coverage Tools](/docs/installingUnitTestingAndCodeCoverageTools.md)
* [How to Debug on Genymotion](/docs/debuggingOnGenymotion.md)