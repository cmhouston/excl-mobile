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

function labelService(){};

labelService.prototype.createLabel = function(text) {
	var label = Ti.UI.createLabel({
		text: text
	});
	return label;
};
labelService.prototype.createCustomLabel = function(args) {
	var label = Ti.UI.createLabel(args);
	return label;
};

module.exports = labelService;

labelService.prototype.countCharInTitleAndReturnFontSize = function(title, maxDip, maxCharAtMaxDip, charIncrement, fontSizeIncrement) {
	length = title.length;
	if (length > maxCharAtMaxDip + (2 * charIncrement)) {
		return maxDip - (3 * fontSizeIncrement) + "dip";
	} else if (length > maxCharAtMaxDip + (charIncrement)) {
		return maxDip - (2 * fontSizeIncrement) + "dip";
	} else if (length > maxCharAtMaxDip) {
		return maxDip - (fontSizeIncrement) + "dip";
	} else if (length < maxCharAtMaxDip + (2 * charIncrement)) {
		return maxDip + "dip";
	} else {
		return maxDip - (4 * fontSizeIncrement) + "dip";
	}
};