var alloyService = {

	Globals : getAlloyGlobals(),
	
	Models : getAlloyModels()
};

function getAlloyGlobals() {
	return Alloy.Globals;
}

function getAlloyModels() {
	return Alloy.Models;
}

module.exports = alloyService;
