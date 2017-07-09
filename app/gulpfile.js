var gulp = require('gulp');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var spritesmith = require('gulp.spritesmith');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('default', ['lint', 'less', 'sprites', 'browserify']);

gulp.task('lint', function () {
    return gulp.src('./src/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'))
});

gulp.task('less', function () {
    return gulp.src('./src/less/*.less')
        .pipe(less())
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('sprites', function () {
    return gulp.src('./src/img/*.png')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.css'
        }))
        .pipe(gulp.dest('./dist/img/'));
});

gulp.task('browserify', function () {
    return browserify('./src/libs.js')
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('./dist/tmp/'));
});