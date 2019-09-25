const { src, dest, series, parallel } = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const del = require('del');
const htmlmin = require('gulp-htmlmin');
const minify = require('gulp-minify');
const sass = require('gulp-sass');

sass.compiler = require('node-sass');

const srcDir = './src/';
const buildDir = './build/'

function clean() {
	return del(buildDir+'**/*');
}

const copyFiles = ['lib/*', 'img/*.+(png|jpg|svg)', 'favicon.png', 'apple-touch-icon.png', 'mask-icon.svg', 'robots.txt'];
function copy(callback) {
	return src(copyFiles, {cwd: srcDir, base: srcDir})
		.pipe(dest(buildDir))
}

function html(callback) {
	return src('*.html', {cwd: srcDir})
		.pipe(htmlmin({
			collapseWhitespace: true,
			removeComments: true,
			minifyCSS: true,
			minifyJS: true
		}))
		.pipe(dest(buildDir))
}

function css(callback) {
	return src(['*.css', '*.min.css'], {cwd: srcDir}) 
		.pipe(autoprefixer({ cascade: true }))
		.pipe(csso({ restructure: false }))
		.pipe(dest(buildDir))
}

function scss(callback) {
	return src(['*.scss'], {cwd: srcDir})
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({ cascade: true }))
		.pipe(csso({ restructure: false }))
		.pipe(dest(buildDir))
}

function js(callback) {
	return src('*.js', {cwd: srcDir})
		.pipe(minify({
			ext: { min: '.js' },
			noSource: true
		}))
		.pipe(dest(buildDir))
}

exports.build = series(clean, parallel(copy, html, scss, js));
exports.default = exports.build
