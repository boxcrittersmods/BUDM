// ==UserScript==
// @name         United Program Interface
// @author       SArpnt and TumbleGamer
// @supportURL   http://discord.gg/D2ZpRUW
// @match        https://boxcritters.com/play/
// @match        https://boxcritters.com/play/?*
// @match        https://boxcritters.com/play/#*
// @match        https://boxcritters.com/play/index.html
// @match        https://boxcritters.com/play/index.html?*
// @match        https://boxcritters.com/play/index.html#*
// @run-at       document-start
// @require      https://github.com/SArpnt/EventHandler/raw/master/script.js
// ==/UserScript==

// TODO

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
	class Module extends EventHandler { // TODO: get EventHandler from my github so it can be compiled into this
		/**
		 * Creates a new Module
		 * @param {Module} [options.parent] Parent of the module
		 * @param {String} [GM_info] GM_info for the module
		 * @param {String} [options.scriptSource] The script for the module
		 */
		constructor({ parent, GM_info, scriptSource, }) {
			this.modInfo = {};
	
			if (this.parent) // if no value key isn't set
				this.parent = parent;
	
			this.modInfo.scriptSource = scriptSource;
	
			if (GM_info) {
				if (typeof GM_info != "object")
					throw new TypeError(`Invalid GM_info!`); // TODO: proper error handling (doesn't break all of UPI)
				if (!GM_info)
					throw new TypeError(`Invalid GM_info!`);
	
				this.modInfo.GM_info = GM_info;
	
				if (!this.modInfo.scriptSource) this.modInfo.scriptSource = GM_info.scriptSource;
				if (!this.modInfo.name) this.modInfo.name = this.modInfo.GM_info.script.name;
				if (!this.modInfo.version) this.modInfo.version = this.modInfo.GM_info.script.name;
			}
	
			if (!scriptSource) throw `No Script Source!`;
			this.modInfo.header = Module.parseScriptHeader(this.modInfo.scriptSource);
	
			this.modInfo.name = this.modInfo.header.name;
			if (!this.modInfo.name) throw `No module name!`;
			this.modInfo.author = this.modInfo.header.author;
			this.modInfo.version = this.modInfo.header.version;
			//if (false && !this.modInfo.version) throw `No module version!`; // TODO: false should be global flag
	
			this.modInfo.id = this.modInfo.header.UPI.id || Module.camelize(this.modInfo.name);
			this.modInfo.abbrev = this.modInfo.header.UPI.abbrev ||
				this.modInfo.name
					.split(" ")
					.map(word => word[0].toUpperCase())
					.join("");
	
			if (this.modInfo.header.UPI.require)
				this.modInfo.require = this.modInfo.header.UPI.require.split(/\s*,\s*/);
	
	
			if (this.parent) {
				this.parent[this.modInfo.id] = this;
				this.modInfo.idList = this.parent.abbrevList.concat([this.modInfo.id]);
				this.modInfo.abbrevList = this.parent.abbrevList.concat([this.modInfo.abbrev]);
			} else {
				this.modInfo.idList = [this.modInfo.id];
				this.modInfo.abbrevList = [this.modInfo.abbrev];
			}
	
			this.info(`${this.modInfo.name} by ${this.modinfo.author}`);
		}
	
		/**
		 * Camelizes a string
		 * @param {String} str String to camelize
		 */
		static camelize(str) {
			return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
				if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
				return index === 0 ? match.toLowerCase() : match.toUpperCase();
			});
		}
	
		static parseScriptHeader(scriptText) {
			let arrayForm = scriptText
				.match(/(?:\/\/\s*)?==UserScript==([\S\s]*)==\/UserScript==/)[1] // get header
				.split(/\n\s*\/\//g) // split into line array
				.map(e => e.trim()) // trim whitespace from all lines
				.filter(e => e) // remove empty lines
				.map(e => {
					let m = e.match(/\s+/); // get first whitespace so string can be split by it
					return [
						e.slice(0, m.index).split('.'), // key, split by .
						e.slice(m.index + m[0].length) // value
					];
				});
	
			mod.debug(`header arrayForm:`, arrayForm);
	
			let objForm = {};
			for (let [path, v] of arrayForm) {
				let fKey = path.pop(),
					cObj = objForm;
				for (let b of path) {
					if (b in cObj && typeof cObj[b] != "object")
						throw `Path ${path.join('.')} has existing value at ${b}`;
					cObj = cObj[b];
				}
				if (fKey in cObj)
					throw `Value ${path.join('.')}.${key} already exists`;
				cObj[fKey] = v;
			}
			return mod.debug(`header objForm:`, objForm);
		}
	};
	
	/**
	 * @name Module#debug
	 * @function
	 * @memberof Module
	 * @description Replacement for console.debug
	 * @param {(...String|...*)} p
	 */
	/**
	 * @name Module#log
	 * @function
	 * @memberof Module
	 * @description Replacement for console.log, usually not reccomended, use debug, info, warn, or error
	 * @param {(...String|...*)} p
	 */
	/**
	 * @name Module#info
	 * @function
	 * @memberof Module
	 * @description Replacement for console.info
	 * @param {(...String|...*)} p
	 */
	/**
	 * @name Module#warn
	 * @function
	 * @memberof Module
	 * @description Replacement for console.warn
	 * @param {(...String|...*)} p
	 */
	/**
	 * @name Module#error
	 * @function
	 * @memberof Module
	 * @description Replacement for console.error
	 * @param {(...String|...*)} p
	 */
	[
		"debug",
		"log",
		"info",
		"warn",
		"error",
	].forEach(e =>
		Module.prototype[e] = function (...p) {
			console[e](`[${this.abbrevList.join('.')}]`, ...p);
			return p[0];
		}
	);

	UPI = new Module({
		name: "United Program Interface",
		author: "SArpnt and TumbleGamer",
		//version: ,
		id: "UPI",
		abbrev: "UPI",
	});
	UPI.info(UPI);

	/**
	 * TODO:
	 * parse header
	 * make module from header info
	 */
})();