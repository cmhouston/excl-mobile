We will be using Mocha for unit testing, Istanbul for code coverage and Sinon for mocking. 


Installing these tools is easy. The root directory of the project contains a `package.json` file which will install all these tools, 
and run the unit tests as well.


* Open command prompt, and make sure you are in the root directory of the project folder. Type `npm install` and hit enter. This will install all the tools and will create a folder called node_modules. 
* To run the unit tests, you would run `npm test` in the root directory. 
* All the unit tests .js files should be in `app/spec/MochaTests`. 
* A 'coverage' folder will be created by Istanbul in the root directory where you will be able to view a html version of the code coverage. The html file will be under `coverage/Icov-report`, and once there you can open `index.html`. 
* Istanbul also provides metrics on command line when you run `npm test`

By default the coverage and node_modules won't be committed to the git repo when ever you commit something.


[Mocha Docs](http://visionmedia.github.io/mocha/#assertions)

[Sinon Docs (For Mocking)](http://sinonjs.org/docs/)