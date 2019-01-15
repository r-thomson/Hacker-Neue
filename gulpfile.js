const gulp = require('gulp');
const del = require('del');
const htmlmin = require('gulp-htmlmin');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const csso = require('postcss-csso');
const minify = require('gulp-minify');

gulp.task('clear', function() {
	return del('build/**/*');
})

const copyFiles = ['src/lib/*', 'src/img/*.+(png|jpg|svg)', 'src/favicon.png', 'src/apple-touch-icon.png'];
gulp.task('copy', function() {
	return gulp.src(copyFiles, {base: 'src/'})
		.pipe(gulp.dest('build/'))
});

const htmlFiles = ['src/*.html'];
gulp.task('html', function(){
	return gulp.src(htmlFiles)
		.pipe(htmlmin({
			collapseWhitespace: true,
			removeComments: true,
			minifyCSS: true,
			minifyJS: true
		}))
		.pipe(gulp.dest('build/'))
});

const cssFiles = ['src/*.css', '!src/*.min.css'];
gulp.task('css', function() {
	return gulp.src(cssFiles)
		.pipe(postcss([
			//cssvariables(),
			autoprefixer({
				cascade: true
			}),
			csso({
				restructure: false
			})
		]))
		.pipe(gulp.dest('build/'))
});

const jsFiles = ['src/*.js', '!src/gulpfile.js'];
gulp.task('js', function() {
	return gulp.src(jsFiles)
		.pipe(minify({
			ext: {
				min: '.js'	
			},
			noSource: true
		}))
		.pipe(gulp.dest('build/'))
});

gulp.task('default', gulp.series('clear', gulp.parallel('copy', 'html', 'css', 'js')));
