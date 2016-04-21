#TiShadow #

##Introduction to TiShadow##

###What it Does###
[TiShadow](http://tishadow.yydigital.com/) is a tool that allows developers to never have to use emulators again. Specifically, it allows you to live deploy simultaneously across multiple real devices using any operating system for development. 

TiShadow also allows to you auto-test your native mobile applications with its built-in jasmine bdd.

###How it Works ###
TiShadow is made up of three  components: the  server, app, and client.

You use the **client** to send your code/commands to the **server** that will push it to the **app** running on your devices.

![TiShadowProcess](http://tishadow.yydigital.com/img/diagram.png)

###More Info###
TiShadow supports traditional titanium projects and alloy projects.

Information shown above was taken courtesy of [tishadow.yydigital.com](http://tishadow.yydigital.com/getting%20started).


##Getting Started##
###1. Download the TiShadow Server off GitHub Via Node Package Manager###
Download the TiShadow Server by opening your command line/terminal and entering 
> **npm install git+https://github.com/dbankier/TiShadow.git**

This will download the server from the GitHub repo, giving you the most recent version of TiShadow.

This step also places TiShadow's executables into your systems path, allowing you to use TiShadow's built in commands.

###2. Download TiShadow Client###

Either [clone](github-mac://openRepo/https://github.com/dbankier/TiShadow) the GitHub repo or [click here](https://github.com/dbankier/TiShadow/archive/master.zip) to download the .zip file for the client. 

After performing one of the above choices, **open Titanium Studio**.
<br/>
<br/>
![import](http://i1369.photobucket.com/albums/ag223/louis_Iaeger/ScreenShot2014-08-08at42530PM_zps9a7167d3.png)

Right click in the project explorer (should be on the left side of Titanium Studio) and **select "import"**.
<br/>
<br/>
![Existing Mobile Project](http://i1369.photobucket.com/albums/ag223/louis_Iaeger/ScreenShot2014-08-08at42555PM_zps1a0195a3.png)


**Select "Existing Mobile Project"** from the options and **click next**.
<br/>
<br/>


![app Folder File](http://i1369.photobucket.com/albums/ag223/louis_Iaeger/ScreenShot2014-08-08at42712PM_zpsa81a6675.png)

**Click "browse"**, find your "TiShadow-Master" folder, and **select the "app" folder** that is inside of it. Then **click finish**.
<br/>
<br/>
![pic2](http://i1369.photobucket.com/albums/ag223/louis_Iaeger/ScreenShot2014-08-08at42738PM_zps8ee86b67.png)

Your app folder should show in the project explorer. Open your command line and type "**TiShadow Server**" to start your" new TiShadow server.
<br/>
<br/>

##Running TiShadow##

Open your command line/terminal and cd (change directories) into the repo (folder) of your project that you want to use TiShadow with. For example, in the picture above I would cd (change directories) into the ExCL Mobile folder.

Then type "**TiShadow run**".
