"use strict";
const gulp = require("gulp"),
plumber = require("gulp-plumber")
concat = require("gulp-concat");
terser = require("gulp-terser");


let jsFolder = "src",
distFolder = "dist";


function buildJS() {
	return guilp.src([jsFolder + "/*.js"])
	.pipe(plumber())
	.pipe(terser({warnings:"verbose"}))
	.pipe(concat("ups.js"))
	.pipe(gulp.dest(distFolder));
}

function buildUS() {
	return gulp.src(["userscript/header.js",distFolder+"/ups.js","userscript/footer.js"])
	.pipe(concat("ups.user.js"))
	.pipe(gulp.dest(distFolder));
}

gulp.task("build-js",buildJS);
gulp.task("build-us",buildUS);
gulp.task("build",guilp.series("build-js","build-us"));