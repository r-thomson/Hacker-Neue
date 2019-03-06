const { src, dest, series, parallel } = require('gulp');
const del = require('del');
const htmlmin = require('gulp-htmlmin');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const csso = require('postcss-csso');
const minify = require('gulp-minify');

const srcDir = './src/';
const buildDir = './build/'

function clean() {
	return del(buildDir+'**/*');
}

const copyFiles = ['lib/*', 'img/*.+(png|jpg|svg)', 'favicon.png', 'apple-touch-icon.png', 'robots.txt'];
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
		.pipe(postcss([
			autoprefixer({
				cascade: true
			}),
			csso({
				restructure: false
			})
		]))
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

exports.build = series(clean, parallel(copy, html, css, js));
exports.default = exports.build
