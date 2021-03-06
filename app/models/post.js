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

exports.definition = {
	config: {
		defaults: {
			name: "post name",
			image: "/700x300.png",
			text: "Ipsum whatever and other stuff"
		},
		adapter: {
			type: "properties",
			collection_name: "post"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
			rawJson: {},
			
			getAllComments: function(){
				return this.get('rawJson').comments;
			},
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
		});

		return Collection;
	}
};