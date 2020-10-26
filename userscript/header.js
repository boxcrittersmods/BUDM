// ==UserScript==
// @name         United Program Interface
// @match        https://boxcritters.com/play/index.html
// @grant        none
// UPI.modules   1,2,3
// UPI.id        upiScript
// UPI.abbrev    UPIS
// ==/UserScript==

let UPI = {
	modInfo: {
		name: "Universal Program Interface",
		id: "UPI",
		abbrev: "UPI",
	},
	exampleSubmodule: { // mods are also modules
		modInfo: {
			name: "Example Submodule",
			id: "exampleSubmodule",
			abbrev: "ES",
		},
	},
};
(function () {
	'use strict';