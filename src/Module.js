class Module extends EventHandler { // TODO: get EventHandler from my github so it can be compiled into this
	/**
	 * Creates a new Module
	 * @param {Object} options
	 * @param {String} options.name Name of the module
	 * @param {String} [options.author] Author of the module
	 * @param {String} [options.version] Version of the module - optional unless global (global is a flag that will be added later)
	 * @param {String} options.id ID of the module - optional but reccomended
	 * @param {String} [options.abbrev] Abbreviation of the module - optional but reccomended
	 * @param {Module} [options.parent] Parent of the module - internal, should not be used
	 * @param {String} [options.scriptSource] The script for the module - internal, should not be used
	 */
	constructor({ name, author, version, id, abbrev, GM_info, parent, scriptSource }) {
		this.parent = parent; // done
		this.modInfo = {}; // done
		this.modInfo.name = name;
		this.modInfo.version = version;
		this.modInfo.scriptSource = scriptSource;
		if (GM_info) {
			if (typeof GM_info != "object")
				throw new TypeError(`Invalid GM_info!`);
			if (!GM_info)
				throw new TypeError(`Invalid GM_info!`);

			this.modInfo.GM_info = GM_info;

			if (!this.modInfo.scriptSource)
				this.modInfo.scriptSource = GM_info.scriptSource;
		}
		if (!scriptText) throw `No Script Text!`;
		if (!this.modInfo.name) this.modInfo.name = this.modInfo.GM_info.script.name;
		if (!this.modInfo.version) this.modInfo.version = this.modInfo.GM_info.script.name;
		if (!this.modInfo.name) throw `No module name!`;
		if (!this.modInfo.version) throw `No module version!`;
		this.modInfo.id = id || Module.camelize(name);
		this.modInfo.abbrev = abbrev || name
			.split(" ")
			.map(word => word[0].toUpperCase())
			.join("");

		if (this.parent) {
			this.modInfo.idList = this.parent.abbrevList.concat([this.modInfo.id]);
			this.modInfo.abbrevList = this.parent.abbrevList.concat([this.modInfo.abbrev]);
			this.parent[this.modInfo.id] = this;
		} else {
			this.modInfo.idList = [this.modInfo.id];
			this.modInfo.abbrevList = [this.modInfo.abbrev];
		}

		//TODO: change this later
		//if (userscriptHeader.logModName) this.info(`${this.modInfo.name} by ${this.modinfo.author}`)
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
		scriptText
			.match(/(?:\/\/\s*)?==UserScript==([\S\s]*)==\/UserScript==/)[1] // get header
			.split(/\n\s*\/\//g)
			.map(e => e.trim()) // trim whitespace from all strings
			.filter(e => e) // remove empty strings
			.map(e => {
				let m = e.match(/\s+/); // get first whitespace so string can be split by it
				return [
					e.slice(0, m.index).split('.'), // key, split by .
					e.slice(m.index + m[0].length) // value
				];
			});
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
		console[e](`[${this.abbrevList}]`, ...p);
		return p[0];
	}
);