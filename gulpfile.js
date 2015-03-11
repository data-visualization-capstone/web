var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat-sourcemap');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');
var browserify = require('browserify');
var watch = require('gulp-watch');

// Browserify
var bundler = watchify(browserify('./src/js/main.js', watchify.args));

// Tasks
gulp.task('default', ['js', 'copy']);
gulp.task('js', bundle); // so you can run `gulp js` to build the file
bundler.on('update', bundle); // on any dep update, runs the bundler

function bundle() {
  return bundler.bundle()
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('js/bundle.js'))
      // TODO
      // .pipe(buffer())
      // .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
      // .pipe(sourcemaps.write({sourceRoot: 'src/'))
    .pipe(gulp.dest('./build'));
}

gulp.task('copy', function () {
  var files = [
    'src/**/*.html',
    'src/**/*.css',
    'src/**/*.png',
    'src/**/*.txt',
    'src/**/*.csv',
    'src/**/*.json'
  ]
  gulp.src(files)
    .pipe(watch(files))
    .pipe(gulp.dest('build/'));
});

