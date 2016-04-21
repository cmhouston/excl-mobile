Getting a "no SD card" error on your genymotion when you try to debug?
Follow these steps to fix that.

1. Go to C:\Users\<username>\AppData\Roaming\Titanium\mobilesdk\win32\3.2.3.GA\android\cli\commands
	if on iOS, go to /Users/parivedadeveloper/Library/Application Support/Titanium/mobilesdk/osx/3.2.3.GA/android/cli/commands
2. Edit "_build.js"
3. Change line 1344 to `} else if (!emu.sdcard && (emu.type !== 'genymotion')) {`

Enjoy!

* Adapted from http://stackoverflow.com/questions/21449970/titanium-studio-3-2-0-cannot-debug-using-genymotion-2-0-3