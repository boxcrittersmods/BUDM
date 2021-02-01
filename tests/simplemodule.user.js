// ==UserScript==
// @name         BUDM simple module
// @match        https://boxcritters.com/play/
// @match        https://boxcritters.com/play/?*
// @match        https://boxcritters.com/play/#*
// @match        https://boxcritters.com/play/index.html
// @match        https://boxcritters.com/play/index.html?*
// @match        https://boxcritters.com/play/index.html#*
// @require      file:///D:/GitHub/BUDM/dist/BUDM.user.js
// BUDM.id       simpleModule
// BUDM.abbrev   SM
// ==/UserScript==

(function () {
	"use strict";

	// BUDM global variables
	[
		BUDM, // duh
		uWindow, // UnsafeWindow but it deals with grant none
		mod, // the module class
	];

	mod.testFunction = function (...vals) {
		mod.info(`WORKING!`, `Recieved values:`, ...vals);
	};
})();