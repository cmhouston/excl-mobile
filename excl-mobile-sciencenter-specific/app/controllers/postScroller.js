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
// expects:
// posts - backbone.js collection of backbone.js model of post type

$.scroller.width = Ti.UI.FILL;
$.scroller.height = Ti.UI.SIZE;

var posts = args.posts;
if (posts) {
	for (var i = 0; i < posts.size(); i++) {
		var post = posts.at(i);
		post = createPostView(post);
		$.scroller.addView(post);
		$.scroller.currentPage = i;
		// Change to current page to froce android arrows to appear
	};
	$.scroller.removeView($.placeholder);
	$.scroller.currentPage = 0;
	// Set current page back to the initial page

} else {
	$.placeholderLabel.text = "There's no content specific for this age. Check above or change your filter!";
}

function createPostView(post) {
	var args = {
		height : Ti.UI.FILL,
		image : post.get('image'),
		top : "0"
	};
	var image = Ti.UI.createImageView(args);

	args = {
		//backgroundColor: 'black',
		opacity : 0.6,
		height : Ti.UI.SIZE,
		top : "0dip"
	};
	var titleBar = Ti.UI.createView(args);

	args = {
		top : 0,
		left : "10dip",
		color : 'white',
		horizontalWrap : false,
		font : {
			// fontFamily : 'Arial',
			fontSize : '25dip',
			fontWeight : 'bold',
			fontFamily : Alloy.CFG.excl.defaultGlobalFontFamily
		},
		//backgroundColor: "black",
		text : post.get('name')
	};
	var title = Ti.UI.createLabel(args);
	titleBar.add(title);

	var view;
	if (OS_IOS) {
		view = image;
	} else if (OS_ANDROID) {
		view = Ti.UI.createView();
		view.add(image);
	}
	view.add(titleBar);

	view.addEventListener('click', function(e) {
		var args = post;
		postController = Alloy.createController('postLanding', args);
		postController.setAnalyticsPageTitle(post.get("name"));
		postController.setAnalyticsPageLevel("Post Landing");
		Alloy.Globals.navController.open(postController);
	});

	return view;
}
