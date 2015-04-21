// Load gulp
var gulp = require('gulp');
var del = require('del');

// Load plugins
var plumber = require('gulp-plumber'),
	concat = require('gulp-concat'),
	sass = require('gulp-sass'),
	livereload = require('gulp-livereload'),
	jshint = require('gulp-jshint'),
	cache = require('gulp-cache'),
	autoprefixer = require('gulp-autoprefixer'),
	imagemin = require('gulp-imagemin'),
  pixrem = require('gulp-pixrem');

//Define paths
var paths = {
  scripts: ['src/site_js/'], // add site scripts here
  vendor_head_scripts: ['src/site_js/vendor/head/*.js'],
  vendor_foot_scripts: ['src/site_js/vendor/foot/console.js','src/site_js/vendor/foot/pubsub.js','src/site_js/vendor/foot/*.js'],
  sass: ['src/site_sass/**/*.scss'],
  html: ['src/__site_html/*.html', 'src/templates/**/*.html'],
  images: ['public_html/assets/site_images/**/*']
};

// JS Hint
gulp.task('lint', function() {
  return gulp.src(paths.scripts)
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Concat the site javascript and livereload
gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(plumber())
    .pipe(concat('global.js'))
    .pipe(gulp.dest('public_html/assets/build/site_js/'))
    .pipe(livereload());
});

// Concat the vendor javascript and livereload
gulp.task('vendor_head_scripts', function() {
  return gulp.src(paths.vendor_head_scripts)
    .pipe(plumber())
    .pipe(concat('vendor-head.js'))
    .pipe(gulp.dest('public_html/assets/build/site_js/vendor/'))
    .pipe(livereload());
});
gulp.task('vendor_foot_scripts', function() {
  return gulp.src(paths.vendor_foot_scripts)
    .pipe(plumber())
    .pipe(concat('vendor-foot.js'))
    .pipe(gulp.dest('public_html/assets/build/site_js/vendor/'))
    .pipe(livereload());
});

// Clean css build folder (in case Sass errors)
gulp.task('clean-css', function() {
  del([
    'public_html/assets/build/site_css/**'
  ]);
});


// Compile the sass + autoprefix + pixrem + livereload
gulp.task('sass', function() {
  return gulp.src(paths.sass)
    .pipe(plumber())
    .pipe(sass({ style: 'expanded', "sourcemap=none": true }))
    .pipe(autoprefixer('> 1%', 'last 2 versions', 'Firefox ESR', 'ie 7', 'ie 8', 'ie 9', 'Opera 12.1', 'Android 4'))
    .pipe(pixrem('16px', { atrules: true }))
    .pipe(gulp.dest('public_html/assets/build/site_css/'))
    .pipe(livereload());
});

// Listen to HTML to trigger livereload
gulp.task('html', function() {
  return gulp.src(paths.html)
    .pipe(plumber())
    .pipe(livereload());
});

// Minify images
gulp.task('images', function() {
  return gulp.src(paths.images)
    .pipe(plumber())
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('public_html/assets/site_images/'))
    .pipe(livereload());
});

// Clean build folders
gulp.task('clean', function() {
  del([
    'public_html/assets/build/site_css/**',
    'public_html/assets/build/site_js/**',
    'public_html/assets/build/site_js/vendor/**'
  ]);
});

// Set the watch task for sass, html, JS
gulp.task('watch', function() {
  livereload.listen();
  gulp.watch(paths.sass, ['clean-css', 'sass']); // Clean css folder incase of any sass files
  gulp.watch(paths.html, ['html']);
  gulp.watch(paths.scripts, ['lint', 'scripts']);
  gulp.watch(paths.vendor_head_scripts, ['vendor_head_scripts']);
  gulp.watch(paths.vendor_foot_scripts, ['vendor_foot_scripts']);
});

// Set the default task when you run gulp, first clean, then normal functions
gulp.task('default', ['clean'], function() {
	gulp.start(
    'sass',
    'scripts',
    'vendor_head_scripts',
    'vendor_foot_scripts',
    'lint',
    'images',
    'watch'
    );
});

gulp.task('clear', function (done) {
  return cache.clearAll(done);
});