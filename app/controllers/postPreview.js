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
var postArgs = args.posts;

var parentScreenName = args.parentScreenName;
var viewService = setPathForLibDirectory("customCalls/viewService");
viewService = new viewService();
var labelService = setPathForLibDirectory("customCalls/labelService");
labelService = new labelService();
var iconService = setPathForLibDirectory("customCalls/iconService");
iconService = new iconService();
var buttonService = setPathForLibDirectory("customCalls/buttonService");
buttonService = new buttonService();

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
		for (var i = 0; i < postArgs.length; i++) {
			post = createPostView(eval(postArgs.at(i)));
			$.backgroundContainer.add(post);
		};
		$.backgroundContainer.height = Ti.UI.SIZE;
		$.placeholderContainer.height = "0";
	} else {
		$.placeholderLabel.text = "There's no content specific for this age. Check above or change your filter!";
	}
}

function createPostView(post) {
	args = {
		width : "100%",
		backgroundColor : "white",
	};
	var container = viewService.createCustomView(args);
	if (Titanium.Platform.osname == "ipad") {
		container.top = "50dip";
		container.height = "300dip";
	} else {
		container.top = "30dip";
		container.height = "200dip";
	}

	args = {
		layout : "vertical",
		width : "95%",
		backgroundColor : "#F8F8F8",
		left : "2%"
	};
	var postContainer = viewService.createCustomView(args);
	if (Titanium.Platform.osname == "ipad") {
		postContainer.height = "300dip";
	} else {
		postContainer.height = "200dip";
	}

	args = {
		height : "50dip",
		width : "100%",
		backgroundColor : "#D8D8D8"
	};
	var header = viewService.createCustomView(args);

	args = {
		height : "50dip",
		width : "99%",
		backgroundColor : "#D8D8D8",
		top : "1%",
		bottom : "1%",
		left: "1%"
	};
	var headerWrap = viewService.createCustomView(args);

	args = {
		color : "#000000",
		text : post.get("name"),
		textAlign : "center",
		font : {
			fontFamily : 'Helvetica Neue',
			fontSize : labelService.countCharInTitleAndReturnFontSize(post.get("name"), 20, 30, 5, 1),
			fontWeight : 'bold'
		}
	};
	var headerText = labelService.createCustomLabel(args);
	if (Titanium.Platform.osname == "ipad") {
		headerText.font = {
			fontFamily : 'Helvetica Neue',
			fontSize : labelService.countCharInTitleAndReturnFontSize(headerText.text, 30, 40, 10, 2)
		};
	}

	args = {
		layout : "horizonal",
		backgroundColor : "#F8F8F8",
		width : "95%",
		top : "2%",
		bottom : "10%"
	};
	var previewContainer = viewService.createCustomView(args);
	if (Titanium.Platform.osname == "ipad") {
		previewContainer.height = "250dip";
	} else {
		previewContainer.height = "150dip";
	}

	args = {
		top : "60%"
	};
	var navArrow = buttonService.createCustomButton(args);
	iconService.setIcon(navArrow, "postNavArrow.png");

	if (Titanium.Platform.osname == "ipad") {
		navArrow.right = "18dip";
		navArrow.height = "25dip";
		navArrow.width = "25dip";
	} else {
		navArrow.right = "0dip";
		navArrow.height = "20dip";
		navArrow.width = "20dip";
	}
	args = {
		left : "0",
		width : "45%",
		top : "10%",
		bottom : "10%",
		image : post.get("image"),
		height : "70%"
	};
	var postImage = viewService.createCustomImageView(args);
	if (!postImage.image) {
		iconService.setIcon(postImage, "placeholder.png");
	}

	args = {
		left : "46%",
		text : post.get("text"),
		color : "#000000",
		font : {
			fontFamily : 'Helvetica Neue',
			fontSize : "16dip",
			color : "#000000"
		},
		top : "10%",
		height : "70%"
	};
	var postText = labelService.createCustomLabel(args);
	if (Titanium.Platform.osname == "ipad") {
		postText.font = {
			fontFamily : 'Helvetica Neue',
			fontSize : "25dip"
		};
	}
	if (!postText.text) {
		postText.text = "Click here to dive in to this activity!";
	}

	postContainer.add(header);
	header.add(headerWrap);
	headerWrap.add(headerText);
	postContainer.add(previewContainer);
	previewContainer.add(postImage);
	previewContainer.add(postText);
	container.add(postContainer);
	container.add(navArrow);

	if (OS_IOS) {
		$.backgroundContainer.bottom = "48dip";
	}

	container.addEventListener('click', function(e) {
		var args = post;
		postController = Alloy.createController('postLanding', args);
		postController.setAnalyticsPageTitle(parentScreenName + '/' + post.get("name"));
		postController.setAnalyticsPageLevel("Post Landing");
		Alloy.Globals.navController.open(postController);
	});

	return container;
}

init();
