# How To Set Up GenyMotion on a Mac #

When using Titanium 3.2 there are a few extra steps necessary to set up GenyMotion on a Mac

## Install GenyMotion ##

1. Install Genymotion and register
- Install your Genymotion emulator
	1. If there is an error associated with the ova file while you're downloading/installing
	   the emulator, navigate to:
	   Finder > Go > Go To Folder > ~/.Genymobile/Genymotion/
	- Remove the contents of the "ova" folder and the folder from "deployed"
	    with the same name as the emulator you were trying to install

- Install Homebrew (reference: http://brew.sh/)
	1. run this in Terminal:
	  $ ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"
  and follow the prompts to complete the installation.

- Run this in Terminal:
  $ brew install android-sdk

- Run this in Terminal:
  $ brew install android-ndk

[STOP]()

7) Show invisible folders [OPTIONAL BUT HIGHLY RECOMMENDED]
	a) Easy way to do this is to install the app inVisible by NorthernSpy Software (http://www.northernspysoftware.com/)
	b) The app runs a set of commands to show and hide invisible files. This can also be done via command line:
		i) Run these 2 lines in Terminal to show invisible files:
			defaults write com.apple.finder AppleShowAllFiles TRUE 
 			killall Finder
		
		ii) Run these 2 lines in Terminal to hide invisible files:
			defaults write com.apple.finder AppleShowAllFiles FALSE 
 			killall Finder
8) Navigate to:
	Finder > Go > Go To Folder > ~/.bash_profile
	(If you can't find this file then you probably didn't do step 7)
  And add the following:
	##
	## Android SDK
	##
	export ANDROID_SDK=/usr/local/Cellar/android-sdk/23.0.2
	export ANDROID_NDK=/usr/local/Cellar/android-ndk/r7b
	a) You may need to change the above paths depending on the current version of the SDK/NDK.
	b) As new Android SDK and NDK's are released, run this in Terminal:
		brew upgrade
	   and edit your ".bash_profile" and Titanium Studio settings for each release.


9) Start the Android SDK Manager
	a) Run this in Terminal: 
		android
	b) Install the appropriate files based on platform
	c) You may need to follow the Appcelerator wiki for installing required SDK components
	   (https://wiki.appcelerator.org/display/guides2/Installing+and+Updating+Android+SDK)

10) Open Titanium Studio and navigate to:
	Titanium Studio > Preferences > Studio > Platforms > Android
	a) set "Android SDK Home" to the version folder of your android sdk, which lives in:
		/usr/local/Cellar/android-sdk/
	   You can confirm this by navigating there yourself with invisible folders being shown
	b) set "Android NDK Home" to the version folder of your android ndk, which lives in:
		/usr/local/Cellar/android-ndk/
	c) NOTE: just selecting the "android-sdk" or "android-ndk" folders will not work, you
	   must highlight the version folder within these
	d) Select your default Emulator

At this point you should be done!




<< Additional Errors >>

Run this in Terminal as a point of reference:
	ti info -t android -o json
    a) For the following steps, try and Find the appropriate file.
       If "null" appears for any of them, this is most likely the problem.

ZipAlign = "null"
	a) Navigate to usr/local/Cellar/android-sdk/[your version number]/build-tools/
	b) Select the latest build and copy the "ZipAlign" file
	c) Paste ZipAlign to usr/local/Cellar/android-sdk/[your version number]/tools/

ndk = "null"
	a) Try redownloading the ndk file from https://developer.android.com/tools/sdk/ndk/index.html#Downloads

	b) Run this in Terminal to update the location of the ndk:
		titanium config android.ndkPath /your/ndk/path/

Any problems opening emulators (iOS or Android)
	a) This error includes error in the util.js file such as "unexpected token".
	   Don't know why this works but it did for me. Run this in Terminal:
		sudo npm install titanium -g

Waiting for emulator to become ready…
	a) Try running this in Terminal to clear your memory:
		./adb kill-server && ./adb start-server && ./adb devices
	b) Try opening the emulator first then building the project
	c) Install the apk manually
		i) Try to build your app with the emulator you want. If it doesn't work, then let it
		   get the step "Installing apk…"
		ii) Create a folder into which you will store your apk files. I put mine on my desktop.
		iii) Retrieve your apk. Titanium created the apk already but was unable to load it into Genymotion,
		     so you're doing that for it. Navigate to the folder:
			/path/to/your/project/…/build/android/bin/
		iv) Find your apk file ( [AppName].apk ) and copy it to the folder you just created.
		v) Open VirtualBox and navigate to your emulator. Go to:
			Settings > Shared Folders > Add Shared Folder
		vi) Find the folder you just created and check on Readonly, Auto-mount, and Make Permanent
		vii) Open your emulator and navigate to:
			Settings > Security > Unknown Sources (allow installation of apps from unknown sources)
		viii) Enable author privileges by navigating to:
			File Manager > Settings > Access Mode
			Set to Root Access mode [forever]
			Note: you will have to force close file manager and reopen it for the files to be detected.
		ix) Find your app in:
			File Manager > mnt > shared > [The_Folder_You_Created]
	    After you have completed this step the first time, repeating it
	    only requires you to follow steps i + iv and restart your emulator to either update an app or install new ones.
	    
(mostly taken from: https://wiki.appcelerator.org/display/community/Managing+the+Android+SDK+and+NDK+on+OSX+using+Homebrew)
