"use strict";
const gulp = require("gulp"),
	plumber = require("gulp-plumber"),
	terser = require("gulp-terser"),
	rename = require("gulp-rename"),
	replace = require("gulp-replace"),
	fs = require("fs"),
	fetch = require('sync-fetch'),

	//upiVersion = require("./package.json").version,

	startingFile = "src/index.js",
	distFolder = "dist",

	includeRegex = /(?<=^([ \t]*).*?)\/\*@(\w*)\s+(?:(url|code)\s+)?(.*?)\s+@\*\//gm,
	includeFunc = function (file, original, indent, loc, txtType, path) {
		console.log(`"${file}"`, `"${original}"`, `"${indent}"`, `"${loc}"`, `"${txtType}"`, `"${path}"`);
		if (loc && loc != file)
			return file ? '' : original;
		let txt;
		if (txtType == "url")
			txt = fetch(path).text();
		else if (txtType == "code")
			txt = path.slice(2, -2);
		else
			txt = fs.readFileSync(`src/${path}`, "utf8");
		return txt
			.replace(includeRegex, (...a) => includeFunc(file, ...a))
			.replace(/\n/g, `\n${indent}`);
	},

	build = function () {
		return gulp.src([startingFile])
			//.pipe(plumber()) // fixes issue with node streams piping
			.pipe(replace(includeRegex, (...a) => includeFunc(null, ...a)));
	},
	buildUser = function () {
		return build()
			.pipe(replace(includeRegex, (...a) => includeFunc('user', ...a)))
			.pipe(rename("UPI.user.js"))
			.pipe(gulp.dest(distFolder));
	},
	buildMin = function () {
		return build()
			.pipe(replace(includeRegex, (...a) => includeFunc('min', ...a)))
			.pipe(terser({ warnings: "verbose" })) // minify
			.pipe(rename("UPI.min.js"))
			.pipe(gulp.dest(distFolder));
	};


gulp.task("build-user", buildUser);
gulp.task("build-min", buildMin);
gulp.task("build", gulp.series("build-user", "build-min"));