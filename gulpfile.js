"use strict";
const gulp = require("gulp"),
	plumber = require("gulp-plumber"),
	terser = require("gulp-terser"),
	rename = require("gulp-rename"),
	replace = require("gulp-replace"),
	fs = require("fs"),

	startingFile = "src/index.js",
	distFolder = "dist",

	includeRegex = /(?<=^([ \t]*).*?)\/\*@\s*(.*?)\s*@\*\//gm,
	includeFunc = function (match, indent, filename) {
		return fs.readFileSync(`src/${filename}`, "utf8")
			.replace(includeRegex, includeFunc)
			.replace(/\n/g, `\n${indent}`);
	};

function buildJS() {
	return gulp.src([startingFile])
		//.pipe(plumber()) // fixes issue with node streams piping
		.pipe(replace(includeRegex, includeFunc))
		.pipe(rename("UPI.user.js"))
		.pipe(gulp.dest(distFolder)) // outputs
		.pipe(terser({
			warnings: "verbose",
		})) // minifies
		.pipe(rename("UPI.min.js"))
		.pipe(gulp.dest(distFolder));
}

gulp.task("build", buildJS);