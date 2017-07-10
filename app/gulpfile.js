var gulp = require('gulp');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var spritesmith = require('gulp.spritesmith');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var concat = require('gulp-concat');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var del = require('del');
var watch = require('gulp-watch');

gulp.task('lint', function () {
    return gulp.src('src/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'))
});

gulp.task('less', function () {
    return gulp.src('src/less/*.less')
        .pipe(less())
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('sprites', function () {
    return gulp.src('src/img/*.png')
        .pipe(spritesmith({
            imgName: 'sprites.png',
            cssName: 'sprites.css'
        }))
        .pipe(gulp.dest('dist/img/'));
});

gulp.task('browserify', function () {
    return browserify('src/libs.js')
        .bundle()
        .pipe(source('libs.js'))
        .pipe(gulp.dest('dist/tmp/'));
});

gulp.task('concat:js', function () {
    return gulp.src(['dist/tmp/*.js', 'src/js/shared/*.js', 'src/js/client/*.js'])
        .pipe(concat('curvation.js'))
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('copy:index', function () {
    return gulp.src('src/index.html')
        .pipe(gulp.dest('dist/'));
});

gulp.task('copy:fonts', function () {
    return gulp.src('node_modules/font-awesome/fonts/*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('compress:css', function () {
    return gulp.src('dist/css/*.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css/'));
});

gulp.task('compress:js', function () {
    return gulp.src('dist/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('delete:tmp', function () {
    return del('dist/tmp/');
});

// @TODO : Fix watch task
gulp.task('watch', function () {
    return watch('src/less/*.less', { ignoreInitial: false })
        .pipe(gulp.dest('build'));
});

gulp.task('default',
    gulp.parallel(
        gulp.series(
            gulp.series(
                gulp.parallel(
                    'lint',
                    'browserify'
                ),
                'concat:js'
            ),
            'compress:js',
            'delete:tmp'
        ),
        gulp.series(
            'less',
            'compress:css'
        ),
        'sprites',
        'copy:index',
        'copy:fonts'
    )
);