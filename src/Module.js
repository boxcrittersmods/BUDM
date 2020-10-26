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
	 * @param {String} [options.scriptText] The script for the module - internal, should not be used
	 */
	constructor({ name, author, version, id, abbrev, parent, scriptText }) {
		if(typeof scriptText == "function") scriptText = scriptText.toString();
		this.parent = parent; // done
		this.modInfo = {}; // done
		this.modInfo.GM_info = ; 
		this.modInfo.name = name || this.modInfo.GM_info.script.name || throw `No module name!`;
		this.modInfo.version = version || this.modInfo.GM_info.script.version || throw `No version!`;
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