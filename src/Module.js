class Module extends EventHandler { // TODO: get EventHandler from my github so it can be compiled into this
	/**
	 * Creates a new Module
	 * @param {Object} options

	 * @param {Module} [options.parent] Parent of the module
	 * @param {String} [options.GM_info] GM_info for the module
	 * @param {String} [options.scriptSource] The script for the module
	 * @param {Object} [options.overrides]
	 * @param {String} options.overrides.name Name of the module
	 * @param {String} [options.overrides.author] Author of the module
	 * @param {String} [options.overrides.version] Version of the module - optional unless global (global is a flag that will be added later)
	 * @param {String} options.overrides.id ID of the module - optional but reccomended
	 * @param {String} [options.overrides.abbrev] Abbreviation of the module - optional but reccomended
	 */
	constructor({ parent, GM_info, scriptSource, overrides, }) {
		super();

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

		if (scriptSource) {
			this.modInfo.header = Module.parseScriptHeader(this.modInfo.scriptSource);

			this.modInfo.name = this.modInfo.header.name;
			this.modInfo.author = this.modInfo.header.author;
			this.modInfo.version = this.modInfo.header.version;

			this.modInfo.id = this.modInfo.header.UPI.id;
			this.modInfo.abbrev = this.modInfo.header.UPI.abbrev;
			if (this.modInfo.header.UPI.require)
				this.modInfo.require = this.modInfo.header.UPI.require.split(/\s*,\s*/);
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

		if (this.parent) {
			this.parent[this.modInfo.id] = this;
			this.modInfo.idList = this.parent.abbrevList.concat([this.modInfo.id]);
			this.modInfo.abbrevList = this.parent.abbrevList.concat([this.modInfo.abbrev]);
		} else {
			this.modInfo.idList = [this.modInfo.id];
			this.modInfo.abbrevList = [this.modInfo.abbrev];
		}

		this.info(this.modInfo.name + (this.modInfo.author ? ` by ${this.modInfo.author}` : ``));
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
		console[e](`[${this.modInfo.abbrevList.join('.')}]`, ...p);
		return p[0];
	}
);