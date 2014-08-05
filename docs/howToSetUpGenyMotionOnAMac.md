# How To Set Up GenyMotion on a Mac #

When using Titanium 3.2 there are a few extra steps necessary to set up GenyMotion on a Mac

## Installing Primary Tools ##

1. [Install Genymotion](http://www.genymotion.com/) and complete registration
- Install your Genymotion emulator
	1. If there is an error associated with the ova file while you're downloading/installing
	   the emulator, navigate to:
	   Finder > Go > Go To Folder > ~/.Genymobile/Genymotion/
	- Remove the contents of the "ova" folder and the folder from "deployed"
	    with the same name as the emulator you were trying to install
- Install [Homebrew](http://brew.sh/)
	1. Run the following command in the terminal and follow the prompts to complete the installation.
	  	
			$ ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"

- Install the Android SDK and NDK using the following commands: 
		
		$ brew install android-sdk
 		$ brew install android-ndk

## Set The Machine's Path to the Android Tools ##

1. Show invisible folders
	- The app runs a set of commands to show and hide invisible files. This can also be done via command line:
		
			$ defaults write com.apple.finder AppleShowAllFiles TRUE 
			$ killall Finder
	
	- Alternately, you can install the inVisible tool by [NorthernSpy Software](http://www.northernspysoftware.com/)
- Navigate to: Finder > Go > Go To Folder > ~/.bash_profile
  And add the following:
	
		##
		## Android SDK
		##
		export ANDROID_SDK=/usr/local/Cellar/android-sdk/23.0.2
		export ANDROID_NDK=/usr/local/Cellar/android-ndk/r7b

	1. You may need to change the above paths depending on the current version of the SDK/NDK. The above code uses SDK Version 23.0.2 and NDK version r7b
	- As new Android SDK and NDK's are released, run this in Terminal:
		
			$ brew upgrade
	- Edit your ".bash_profile" and Titanium Studio settings for each release.

## Install Remaining SDK Components ##

- Start the Android SDK Manager
	1. Run this in Terminal: 

			$ android
	- Install the appropriate files based on platform **Alex
	- To install required SDK components refer to this [Appcelerator Wiki](https://wiki.appcelerator.org/display/guides2/Installing+and+Updating+Android+SDK)

## Set Titanium Paths for Android Tools##

1. Open Titanium Studio and navigate to:
	Titanium Studio > Preferences > Studio > Platforms > Android

- Set "Android SDK Home" to the version folder of your android sdk, which lives in:
	/usr/local/Cellar/android-sdk/
- Set "Android NDK Home" to the version folder of your android ndk, which lives in:
	/usr/local/Cellar/android-ndk/
	- NOTE: just selecting the "android-sdk" or "android-ndk" folders will not work, you must highlight the version folder within these
	
- Select your default Emulator

At this point you should be done!

## Troubleshooting ##

### General Troubleshooting ###
Run this in Terminal as a point of reference:
	
	ti info -t android -o json

For the following steps, try and find the appropriate file. If "null" appears for any of them, this is most likely the problem.

### Common Issues ###
#### ZipAlign = "null" ####

1. Navigate to usr/local/Cellar/android-sdk/[your version number]/build-tools/
- Select the latest build and copy the "ZipAlign" file
- Paste ZipAlign to usr/local/Cellar/android-sdk/[your version number]/tools/

#### ndk = "null" ####
1. Try redownloading the ndk file from [https://developer.android.com/tools/sdk/ndk/index.html#Downloads](https://developer.android.com/tools/sdk/ndk/index.html#Downloads)
- Run this in Terminal to update the location of the ndk:
		titanium config android.ndkPath /your/ndk/path/

(mostly taken from: https://wiki.appcelerator.org/display/community/Managing+the+Android+SDK+and+NDK+on+OSX+using+Homebrew)
