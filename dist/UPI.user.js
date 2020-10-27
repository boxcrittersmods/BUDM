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
	/**
	 * Module class
	 * @class UPI#Module
	 * @extends EventHandler
	 */
	class Module extends EventHandler {
		/**
		 * Creates a new Module
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
		 * @throws Will throw if there is no script source
		 */
		constructor({ parent, GM_info, scriptSource, overrides, }) {
			super();
	
			this.modInfo = {};
	
			if (parent) this.parent = parent;
			if (scriptSource) this.modInfo.scriptSource = scriptSource;
	
			if (GM_info) {
				if (typeof GM_info != "object")
					throw new TypeError(`Invalid GM_info!`); // TODO: proper error handling (doesn't break all of UPI)
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
	
				if (this.modInfo.header.UPI) {
					this.modInfo.id = this.modInfo.header.UPI.id;
					this.modInfo.abbrev = this.modInfo.header.UPI.abbrev;
					this.modInfo.deps = this.modInfo.header.UPI.deps.split(/\s*,\s*/).filter(e => e);
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
		 * parses a scriprs header
		 * @private
		 * @param {String} scriptText Script text to parse
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

	UPI = new Module({
		GM_info,
		overrides: {
			name: "United Program Interface",
			author: "SArpnt and TumbleGamer",
			//version: , // TODO
			id: "UPI",
			abbrev: "UPI",
		}
	});
	UPI.info(UPI);

	/**
	 * TODO:
	 * create userscript module
	 * handle deps
	 */
})();