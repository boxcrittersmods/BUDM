"use strict";
const gulp = require("gulp"),
	plumber = require("gulp-plumber"),
	terser = require("gulp-terser"),
	rename = require("gulp-rename"),
	replace = require("gulp-replace"),
	fs = require("fs"),
	fetch = require('sync-fetch'),

	startingFile = "src/index.js",
	distFolder = "dist",

	includeRegex = /(?<=^([ \t]*).*?)\/\*@\s+(url\s+)?(.*?)\s+@\*\//gm,
	minIncludeRegex = /(?<=^([ \t]*).*?)\/\*@min\s+(url\s+)?(.*?)\s+@\*\//gm,
	includeFunc = function (match, indent, url, path) {
		let txt;
		if (url)
			txt = fetch(path).text();
		else
			txt = fs.readFileSync(`src/${path}`, "utf8");
		return txt
			.replace(includeRegex, includeFunc)
			.replace(/\n/g, `\n${indent}`);
	},

	buildJS = function () {
		return gulp.src([startingFile])
			//.pipe(plumber()) // fixes issue with node streams piping
			.pipe(replace(includeRegex, includeFunc))
			.pipe(rename("UPI.user.js"))
			.pipe(gulp.dest(distFolder)) // outputs
			.pipe(replace(minIncludeRegex, includeFunc))
			.pipe(terser({
				warnings: "verbose",
			})) // minifies
			.pipe(rename("UPI.min.js"))
			.pipe(gulp.dest(distFolder));
	};

gulp.task("build", buildJS);