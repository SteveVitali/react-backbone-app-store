var gulp = require('gulp');
var uglify = require('gulp-uglify');
var react = require('gulp-react');
var replace = require('gulp-replace');
var concat = require('gulp-concat');

// Build the version located at /dist/react-backbone-app-store.min.js
// that can be used globally or through bower
gulp.task('build-global', function() {
  gulp.src('src/*.js')
    .pipe(react())
    .pipe(replace(
      'module.exports = AppStore',
      'window.AppStore = AppStore'
    ))
    .pipe(replace("var React = require('react');", ''))
    .pipe(replace("var _ = require('lodash');", ''))
    .pipe(concat('react-backbone-app-store.js'))
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(concat('react-backbone-app-store.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function() {
  gulp.watch('src/*.js', ['build-global']);
});

gulp.task('default', ['watch']);
