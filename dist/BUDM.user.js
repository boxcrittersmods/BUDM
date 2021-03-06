// ==UserScript==
// @name         Boxcritters Userscript Dependency Manager
// @author       SArpnt and TumbleGamer
// @supportURL   http://discord.gg/D2ZpRUW
// @include      /^https:\/\/boxcritters\.com\/play\/(index\.html)?([\?#].*)?$/
// @run-at       document-start
// @require      https://github.com/SArpnt/EventHandler/raw/master/script.js
// ==/UserScript==

// TODO

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

	
	/**
	 * @file Module Class
	 * @author TumbleGamer SArpnt
	 * @copyright 2020 The Box Critters Modding Community
	 * @licence Apache-2.0
	 */
	/**
	 * @external EventHandler
	 * @see {@link https://github.com/SArpnt/EventHandler}
	 */
	class Module extends EventHandler {
		/**
		 * Creates a new Module
		 * @extends EventHandler
		 * @param {Object} options
		 * @param {Module} [options.parent] Parent of the module
		 * @param {String} [options.GM_info] GM_info for the module
		 * @param {String} [options.scriptSource] The script for the module
		 * @param {Object} [options.overrides] Override any part of modInfo
		 * @param {String} options.overrides.name Name of the module
		 * @param {String} [options.overrides.author] Author of the module
		 * @param {String} [options.overrides.version] Version of the module - optional unless global (global is a flag that will be added later)
		 * @param {String} options.overrides.id ID of the module - optional but reccomended
		 * @param {String} [options.overrides.abbrev] Abbreviation of the module - optional but reccomended
		 * 
		 * @throws {TypeError} There must be a GM_info that is not undefined.
		 * @throws {"No Script Source!"} The script source is required.
		 * @throws {"No module name!"} The module name is required.
		 */
		constructor({ parent, GM_info, scriptSource, overrides, }) {
			super();
	
			this.modInfo = {};
	
			if (parent) this.parent = parent;
			if (scriptSource) this.modInfo.scriptSource = scriptSource;
	
			if (GM_info) {
				if (typeof GM_info != "object")
					throw new TypeError(`Invalid GM_info!`); // TODO: proper error handling (doesn't break all of BUDM)
				if (!GM_info)
					throw new TypeError(`Invalid GM_info!`);
	
				this.modInfo.GM_info = GM_info;
	
				if (!this.modInfo.scriptSource) this.modInfo.scriptSource = GM_info.scriptSource;
			}
	
			if (this.modInfo.scriptSource) {
				this.modInfo.header = Module.parseScriptHeader(this.modInfo.scriptSource);
	
				this.modInfo.name = this.modInfo.header.name;
				this.modInfo.author = this.modInfo.header.author;
				this.modInfo.version = this.modInfo.header.version;
	
				if (this.modInfo.header.BUDM) {
					this.modInfo.id = this.modInfo.header.BUDM.id;
					this.modInfo.abbrev = this.modInfo.header.BUDM.abbrev;
					this.modInfo.deps = this.modInfo.header.BUDM.deps.split(/\s*,\s*/).filter(e => e);
				}
			} else
				if (!overrides) throw `No Script Source!`;
	
			if (overrides) {
				for (let k in overrides)
					this.modInfo[k] = overrides[k];
			}
	
			if (!this.modInfo.name) throw `No module name!`;
			//if (false && !this.modInfo.version) throw `No module version!`; // TODO: false should be global flag
	
			this.modInfo.id = this.modInfo.id || Module.camelize(this.modInfo.name);
			this.modInfo.abbrev = this.modInfo.abbrev ||
				this.modInfo.name
					.split(" ")
					.map(word => word[0].toUpperCase())
					.join("");
			this.modInfo.depsLoaded = !this.modInfo.deps;
	
			if (this.parent) {
				this.parent[this.modInfo.id] = this;
				this.modInfo.idList = this.parent.abbrevList.concat([this.modInfo.id]);
				this.modInfo.abbrevList = this.parent.abbrevList.concat([this.modInfo.abbrev]);
			} else {
				this.modInfo.idList = [this.modInfo.id];
				this.modInfo.abbrevList = [this.modInfo.abbrev];
			}
	
			this.info(this.modInfo.name + (this.modInfo.author ? ` by ${this.modInfo.author}` : ``));
	
			if (this.parent) this.parent.emit('submoduleLoaded', this);
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
		/**
		 * parses a script's header
		 * @param {String} scriptText Script text to parse
		 * 
		 * @throws {"Value K already exists"} K cannot already exist
		 * @throws {"Path has existing value"} Path cannot have an existing value
		 * @throws {"Value already exists"} Some key in the path cannot already exist
		 */
		static parseScriptHeader(scriptText, debug) {
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
	
			if (debug) debug(`header arrayForm:`, arrayForm);
	
			let objForm = {};
			for (let [path, v] of arrayForm) {
				let fKey = path.pop();
				if (fKey[0] == '@' && !path.length) {
					let k = fKey.slice(1);
					if (k in objForm)
						if (Array.isArray(objForm[k]))
							objForm[k].push(v);
						else
							throw `Value ${k} already exists`;
					else
						objForm[k] = [v];
				} else {
					let cObj = objForm;
					for (let b of path) {
						if (b in cObj && typeof cObj[b] != "object")
							throw `Path ${path.join('.')} has existing value at ${b}`;
						cObj = cObj[b];
					}
					if (fKey in cObj)
						throw `Value ${path.join('.')}.${fKey} already exists`;
					cObj[fKey] = v;
				}
			}
			if (debug) debug(`header objForm:`, objForm);
			return objForm;
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
			console[e](`[${this.modInfo.abbrevList.join('.')}]`, ...p);
			return p[0];
		}
	);

	BUDM = new Module({
		GM_info,
		overrides: {
			name: "Boxcritters Userscript Dependency Manager",
			author: "SArpnt and TumbleGamer",
			//version: , // TODO
			id: "BUDM",
			abbrev: "BUDM",
		}
	});
	BUDM.debug(`Created root module:`, BUDM);

	/**
	 * TODO:
	 * create userscript module
	 * handle deps
	 */
})();