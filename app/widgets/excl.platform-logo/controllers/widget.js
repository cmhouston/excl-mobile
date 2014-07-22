function animate() {
	// Determine rotation degrees based on platform
	var rotationDegrees = 0;
	if (OS_ANDROID){
		rotationDegrees = 360;
	} else if (OS_IOS) {
		rotationDegrees = -360;
	}
	
	// Spin!
	var matrix2d = Ti.UI.create2DMatrix();
	matrix2d = matrix2d.rotate(rotationDegrees);
	var a = Ti.UI.createAnimation({
	    transform: matrix2d,
	    duration: 1000,
	    autoreverse: false,
	    repeat: 3
	});
	$.logoView.animate(a);
}

var init = function(options) {
	// Determine which logo path to use based on platform
	var logoPath = "";
	if (OS_ANDROID){
		logoPath = options.androidLogoPath;
	} else if (OS_IOS) {
		logoPath = options.iosLogoPath;
	}
	
	// Show logo
	$.logoView.image = logoPath;
	$.logoView.anchorPoint = {
        x : 0.5,
        y : 0.5
	};
	
	animate();
};

exports.init = init;