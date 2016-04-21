//======================================================================
// ExCL is an open source mobile platform for museums that feature basic
// museum information and extends visitor engagement with museum exhibits.
// Copyright (C) 2014  Children's Museum of Houston and the Regents of the
// University of California.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//=====================================================================

var args = arguments[0] || {};
var postArgs = args[0].posts;
var allInclusiveTabTitle = args[1];
var sectionIndex = args[2];

var parentScreenName = args[0].parentScreenName;
var viewService = setPathForLibDirectory("customCalls/viewService");
viewService = new viewService();
var labelService = setPathForLibDirectory("customCalls/labelService");
labelService = new labelService();
var iconService = setPathForLibDirectory("customCalls/iconService");
iconService = new iconService();
var buttonService = setPathForLibDirectory("customCalls/buttonService");
buttonService = new buttonService();
var detectDevice = setPathForLibDirectory('customCalls/deviceDetectionService');
detectDevice = new detectDevice();

function setPathForLibDirectory(libFile) {
	if ( typeof Titanium == 'undefined') {
		lib = require("../../lib/" + libFile);
	} else {
		lib = require(libFile);
	}
	return lib;
};

function init() {
	if (postArgs) {
		Ti.API.info("--Valid post args found. Adding preview.");
		for (var i = 0; i < postArgs.length; i++) {
			post = createPostView(eval(postArgs.at(i)));
			$.backgroundContainer.add(post);
		};
		$.backgroundContainer.height = Ti.UI.SIZE;
		$.placeholderContainer.height = "0";
	} else {
		Ti.API.info("--Invalid post args found. Throwing Error.");
		post = createErrorView("101 Looks like there is no content specific for this filter. It may have been moved to the " + allInclusiveTabTitle + "tab above, check there!");
		$.backgroundContainer.add(post);
		$.backgroundContainer.height = Ti.UI.SIZE;
		$.placeholderContainer.height = "0";
	}

}

function createErrorView(msg) {
	args = {
		width : "100%",
		backgroundColor : Alloy.CFG.excl.colors.pageBackgroundColor,
	};
	var container = viewService.createCustomView(args);
	if (detectDevice.isTablet()) {
		container.top = "25dip";
		container.height = "300dip";
	} else {
		container.top = "15dip";
		container.height = "200dip";
	}

	args = {
		layout : "vertical",
		width : "95%",
		backgroundColor : Alloy.CFG.excl.colors.sectionSecondaryColors[sectionIndex],
		left : "2%",
		height : Ti.UI.SIZE
	};
	var postContainer = viewService.createCustomView(args);

	args = {
		color : Alloy.CFG.excl.colors.darkFontColor,
		text : msg,
		textAlign : "center",
		font : {
			fontSize : "20dip",
			fontFamily : Alloy.CFG.excl.defaultGlobalFontFamily
		}
	};
	var headerText = labelService.createCustomLabel(args);
	if (detectDevice.isTablet()) {
		headerText.font = {
			fontSize : "25dip",
			fontFamily : Alloy.CFG.excl.defaultGlobalFontFamily
		};
	}

	postContainer.add(headerText);
	container.add(postContainer);

	if (OS_IOS) {
		$.backgroundContainer.bottom = "48dip";
	}
	return container;
}

function createPostView(post) {
	args = {
		width : "100%",
		backgroundColor : Alloy.CFG.excl.colors.pageBackgroundColor,
	};
	var container = viewService.createCustomView(args);
	if (detectDevice.isTablet()) {
		container.top = "25dip";
		container.height = "250dip"; //container.height = "300dip";
	} else {
		container.top = "15dip";
		container.height = "100dip"; //container.height = "200dip";
	}
	
	sectionIndexSecondary = sectionIndex % Alloy.CFG.excl.colors.sectionSecondaryColors.length;
	args = {
		layout : "vertical",
		width : "95%",
		left : "2%",
		backgroundColor : Alloy.CFG.excl.colors.sectionSecondaryColors[sectionIndexSecondary],
	};
	var postContainer = viewService.createCustomView(args);
	if (detectDevice.isTablet()) {
		postContainer.height = "250dip"; //postContainer.height = "300dip";
	} else {
		postContainer.height = "100dip"; //postContainer.height = "200dip";
	}
	
	
	//GUI change: removing header with post title
	//create the post title header with colored background
	/*
	sectionIndexPrimary = sectionIndex % Alloy.CFG.excl.colors.sectionPrimaryColors.length;
	args = {
		height : "50dip",
		width : "100%",
		backgroundColor : Alloy.CFG.excl.colors.sectionPrimaryColors[sectionIndexPrimary]
	};
	var header = viewService.createCustomView(args);

	args = {
		height : "50dip",
		width : "99%",
		top : "1%",
		bottom : "1%",
		left : "1%"
	};
	var headerWrap = viewService.createCustomView(args);

	args = {
		color : Alloy.CFG.excl.colors.lightFontColor,
		text : post.get("name"),
		textAlign : "center",
		font : {
			fontSize : labelService.countCharInTitleAndReturnFontSize(post.get("name"), 20, 30, 5, 2),
			fontWeight : 'bold',
			fontFamily : Alloy.CFG.excl.defaultGlobalFontFamily
		}
	};
	var headerText = labelService.createCustomLabel(args);
	if (detectDevice.isTablet()) {
		headerText.font = {

			fontSize : labelService.countCharInTitleAndReturnFontSize(headerText.text, 30, 40, 10, 2),
			fontFamily : Alloy.CFG.excl.defaultGlobalFontFamily
		};
	}
*/

	//create the preview container
	args = {
		//layout : "horizontal",
		height: "100%",
		width : "95%",
		verticalAlign: "top",
		// backgroundColor: "#0ff"
		//top : "12%",
		//bottom : "10%"
	};
	var previewContainer = viewService.createCustomView(args);
	/*if (detectDevice.isTablet()) {
		previewContainer.height = "250dip";
	} else {
		previewContainer.height = "125dip";
	}*/
	
	
	//create a container for the image, prevents image from being longer than 45% of parent container
	args = {
		// layout : "horizontal",
		left: "0",
		//top : "10%",
		//bottom : "10%",
		height: Ti.UI.SIZE,
		//height: "80%",
		width: "45%",
		// backgroundColor: "#F00",
		verticalAlign: "center",
		//center: {x: "auto", y: "50%"}
	};
	var imageContainer = viewService.createCustomView(args);

	//GUI change: removing arrow
	/*
	args = {
		top : "60%"
	};
	var navArrow = buttonService.createCustomButton(args);
	iconService.setIcon(navArrow, "postNavArrow.png");

	if (detectDevice.isTablet()) {
		navArrow.right = "12dip";
		navArrow.height = "25dip";
		navArrow.width = "25dip";
	} else {
		navArrow.right = "0dip";
		navArrow.height = "20dip";
		navArrow.width = "20dip";
	}
	*/
	
	//create the view that contains the post image itself
	args = {
		left : "0",
		top : "0%", //top : "10%",
		bottom : "0%", //bottom : "10%",
		image : post.get("image"), // 'http://www.team2bit.com/playpads/360x200.png',
    	width : "auto", //keep aspect ratio
    	height : "auto", //keep aspect ratio
    	// backgroundColor: "#0f0",
    	verticalAlign: "center"
    	//height : "80%",
		//width : "45%",
	};
	var postImage = viewService.createCustomImageView(args);
	if (!postImage.image) {
		iconService.setIcon(postImage, "placeholder.png");
	}

 	//create the view that contains the post text
	args = {
		left : "46%",
		text : post.get("name"),//post.get("text"), //replace post text with post title
		color : Alloy.CFG.excl.colors.darkFontColor,
		font : {
			fontSize : "15dip",
			fontFamily : Alloy.CFG.excl.defaultGlobalFontFamily
		},
		//top : "10%",
		height : Ti.UI.SIZE,
		// backgroundColor:"#f0f"
	};
	var postText = labelService.createCustomLabel(args);
	if (detectDevice.isTablet()) {
		postText.font = {
			fontSize : "25dip",
			fontFamily : Alloy.CFG.excl.defaultGlobalFontFamily
		};
	}
	if (!postText.text) {
		postText.text = "Click here to dive into this activity!";
	}

	//postContainer.add(header);
	//header.add(headerWrap);
	//headerWrap.add(headerText);
	postContainer.add(previewContainer);
	imageContainer.add(postImage);
	previewContainer.add(imageContainer);
	previewContainer.add(postText);
	container.add(postContainer);
	//GUI change: removing arrow
	//container.add(navArrow);

	if (OS_IOS) {
		$.backgroundContainer.bottom = "48dip";
	}

	container.addEventListener('click', function(e) {
		sectionIndexPrimary = sectionIndex % Alloy.CFG.excl.colors.sectionPrimaryColors.length;
		var args = [post, Alloy.CFG.excl.colors.sectionPrimaryColors[sectionIndexPrimary]];
		postController = Alloy.createController('postLanding', args);
		postController.setAnalyticsPageTitle(parentScreenName + '/' + post.get("name"));
		postController.setAnalyticsPageLevel("Post Landing");
		Alloy.Globals.navController.open(postController);
	});

	return container;
}

init();
