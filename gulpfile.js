"use strict";
const gulp = require("gulp"),
	plumber = require("gulp-plumber");
concat = require("gulp-concat"),
	terser = require("gulp-terser"),
	include = require("gulp-include");


let startingFile = "src/index.js",
	distName = "UPI.user.js";
distFolder = "dist";


function buildJS() {
	return guilp.src([startingFile])
		.pipe(plumber())//fixes issue with Node Streams piping
		.pipe(include({
			extensions: 'js',
			hardFail: true,
			separateInputs: true,
			includePaths: [
				__dirname + '/src'
			]
		}))//add includes
		.pipe(terser({ warnings: "verbose" }))//Minfifies
		//propably not needed since we have one input file
		.pipe(concat(distName))//Joins the files
		.pipe(gulp.dest(distFolder));//outputs
}

gulp.task("build", buildJS);