var gulp = require('gulp');
var gutil = require('gulp-util');
var less = require('gulp-less');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var webserver = require('gulp-webserver');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');
var browserify = require('browserify');
var watch = require('gulp-watch');
var path = require('path');

// $ gulp -> [Development] Starts watch task and web server
gulp.task('default', ['build', 'watch']);

// $ gulp build -> [Production] Builds files
gulp.task('build', ['bundle', 'less', 'concat', 'copy', 'vendor']);

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch('src/js/*.js',    ['concat']);
  gulp.watch('src/less/*.less',  ['less']);
  gulp.watch('src/js/*.js', ['vendor']);
});

// Browserify
var bundler = watchify(browserify('./src/js/main.js', watchify.args));

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

gulp.task('bundle', bundle);

// Copy source files into Build
gulp.task('copy', function () {

  // Copy file types.

  var files = [
    'src/index.html',
    'src/**/*.html',
    'src/**/*.png',
    'src/**/*.txt',
    'src/**/*.csv',
    'src/**/*.json',
    'src/**/*.css',
  ]

  gulp.src(files)
    .pipe(watch(files))
    .pipe(gulp.dest('build/'));
});

// Copy vendored JS
gulp.task('vendor', function () {

  // Copy file types.
  // LESS, CSS, and JS are
  // ingore since they are
  // compiled elsewhere

  var files = [
    'src/js/vendor/**/*'
  ]

  gulp.src(files)
    .pipe(gulp.dest('build/js/vendor'));
})

// Concat JS dependencies
gulp.task('concat', function() {
  return gulp.src([

      // External Libraries
      './bower_components/jquery/dist/jquery.js',
      './bower_components/underscore/underscore.js',
      './bower_components/moment/moment.js',
      './bower_components/d3/d3.js',
      './bower_components/semantic-ui/dist/semantic.js',
      './bower_components/nouislider/distribute/jquery.nouislider.all.min.js',

      // Our JS Files
      './src/js/map.js',
      './src/js/modules/heatmap.js',
      './src/js/modules/hex.js',
      './src/js/modules/scatterplot.js',
    ])
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./build/js/'));
});

// Compile LESS to CSS
gulp.task('less', function () {
  return gulp.src('src/less/styles.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }))
    .pipe(gulp.dest('build/css'));
});

// Create HTTP Web Server
gulp.task('webserver', function() {
  gulp.src('build')
    .pipe(webserver({
      directoryListing : false,
      livereload: true,
      open: false
    }));
});
