// ==UserScript==
// @name         UPI simple module
// @match        https://boxcritters.com/play/
// @match        https://boxcritters.com/play/?*
// @match        https://boxcritters.com/play/#*
// @match        https://boxcritters.com/play/index.html
// @match        https://boxcritters.com/play/index.html?*
// @match        https://boxcritters.com/play/index.html#*
// @require      file:///D:/GitHub/UPI/dist/UPI.user.js
// UPI.id        simpleModule
// UPI.abbrev    SM
// ==/UserScript==

(function () {
	"use strict";

	// UPI global variables
	[
		UPI, // duh
		uWindow, // UnsafeWindow but it deals with grant none
		mod, // the module class
	];

	mod.testFunction = function (...vals) {
		mod.info(`WORKING!`, `Recieved values:`, ...vals);
	};
})();