/*@ header.js @*/

const uWindow = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
let UPI;
(function () {
	"use strict";
	let exposedVars = {
		uWindow,
		UPI,
	};

	if (window.UPI) {
		for (let i in exposedVars)
			delete window[i];
		throw `UPI variables are global! please scope/sandbox it`;
	}

	// Module class structure
	({
		modInfo: {
			name: "Universal Program Interface",
			id: "UPI",
			abbrev: "UPI",
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

	UPI = new Module/*@ UPIModuleInfo.js @*/;
	UPI.info(UPI);

	/**
	 * TODO:
	 * create userscript module
	 * handle deps
	 */
})();