
/**
 * @file UPI Userscript
 * @author TumbleGamer SArpnt
 * @copyright 2020 The Box Critters Modding Community
 * @licence Apache-2.0
 */


(function () {
	'use strict';
	let blacklist = [ // invalid ids
		"mods",
		"modInfo",
		"name",
		"id",
		"GM_info",
		"parent",
		/*any parent module,*/
	];
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
})();