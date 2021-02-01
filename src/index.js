/*@ header.js @*/

const uWindow = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
let BUDM;
(function () {
	"use strict";
	let exposedVars = {
		uWindow,
		BUDM,
	};

	if (window.BUDM) {
		for (let i in exposedVars)
			delete window[i];
		throw `BUDM variables are global! please scope/sandbox it`;
	}

	// Module class structure
	({
		modInfo: {
			name: "Boxcritters Userscript Dependency Manager",
			id: "BUDM",
			abbrev: "BUDM",
		},
		exampleSubmodule: { // mods can also be modules
			modInfo: {
				name: "Example Submodule",
				id: "exampleSubmodule", // used as object key
				abbrev: "ES",
			},
		},
	});

	/*@min url https://github.com/SArpnt/EventHandler/raw/master/script.js @*/
	/*@ Module.js @*/

	BUDM = new Module/*@ BUDMModuleInfo.js @*/;
	BUDM.debug(`Created root module:`, BUDM);

	/**
	 * TODO:
	 * create userscript module
	 * handle deps
	 */
})();