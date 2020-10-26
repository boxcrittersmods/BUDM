// ==UserScript==
// @name         United Program Interface
// @match        https://boxcritters.com/play/index.html
// @grant        none
// UPI.modules   1,2,3
// UPI.id        upiScript
// UPI.abbrev    UPIS
// ==/UserScript==


/*
no window with globalish let
data stored in userscript header / similar header
module loading
everything is modules and modules can contain more modules
log giving [UPI > module > submodule]
make contained modules the same as userscripts so they can be installed by themselves
modules can either load and only be for individual userscripts or they can be global and have some kind of version handling

Mod <-> Module?

nodejs Module wrapper

hopefully every boxcritters api joins the upi family


RegisterMod



(function(exports, require, module, __filename, __dirname) {
	
});

In there begining there was nothing
Then there was UPI
then upi created x amount of the core APIS

*/


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
	'use strict';
	class Module {
		constructor({ name, author, version, id, abbrev }) {
			this.submodules = []
			this.modInfo = {};
			this.modInfo.GM_info
			this.modInfo.name = name || GM_info.script.name || throw `No module name!`
			this.modInfo.version = version || GM_info.script.version || throw `No version!`

			//if (userscriptHeader.logModName) console.log([modInfo.name] by modinfo.author)

			this.modInfo.id = id || Module.camelize(name);
				this.modInfo.abbrev = abbrev || name
					.split(" ")
					.map(word => word[0].toUpperCase())
					.join("");
		}

		log(...p) {
			console.debug(`[${this.abbrev}]`, ...p);
			return p[0];
		}

		static camelize(str) {
			return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
				if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
				return index === 0 ? match.toLowerCase() : match.toUpperCase();
			});
		}
	};

	class Mod extends Module {
		constructor({ name, author, version, id, abbrev }) {
			super({ name, author, version, id, abbrev })
		}
}

	let uWindow = typeof unsafeWindow != 'undefined' ? unsafeWindow : window;

	/**
	 * module 
	 * module id = UPI
	 * module abbrev = UPI
	 * module settings = {
	 * 	global: true
	 * }
	 */

	let log = (...a) => console.debug(`[UPI TEST]`, ...a);

	log({
		gmInfoType: typeof GM_info,
		gmInfo: GM_info,
		processedHeader:
			GM_info.script.header
				.split(/\n\s*\/\//g)
				.map(e => e.trim())
				.filter(e => e)
				.map(e => {
					let m = e.match(/\s+/);
					return [e.slice(0, m.index).split('.'), e.slice(m.index + m[0].length)];
				}),
		uWindowType: typeof unsafeWindow,
		isGlobal: !!window.apiVar,
	});

	if (window.apiVar) {
		delete window.apiVar;
		throw `apiVar is global! please scope/sandbox it`;
	}

	//let
})();