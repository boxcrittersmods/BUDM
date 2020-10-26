//=require header.js

let uWindow = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;
let UPI = {
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
};
(function () {
	"use strict";

	let moduleVars = {
		
	}

	if (window.UPI) {
		delete window.UPI;
		throw `UPI variables are global! please scope/sandbox it`;
	}

	//=require Module.js
})();

//A file that is included with require will only be included if it has not been included before.
// Files included with include will always be included.

//TODO: test documentation and build system