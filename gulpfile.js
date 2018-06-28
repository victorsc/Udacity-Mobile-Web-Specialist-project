const gulp = require('gulp');
const runSequence = require('run-sequence');
const del = require('del');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

const jsFiles = [
    'static/js/idb.js',
    'static/js/indexeddb.js',
    'static/js/dbhelper.js'
];

gulp.task('clean', () => {
    return del.sync('public');
});

gulp.task('copy-static', () => {
    gulp.src('static/css/*')
        .pipe(gulp.dest('public/css'));
    gulp.src('static/img/**/*')
        .pipe(gulp.dest('public/img'));
    gulp.src('static/*')
        .pipe(gulp.dest('public'));
});

gulp.task('css-minify', () => {
    return gulp.src('static/css/*.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest('public/css'));
});

gulp.task('scripts', function() {
    return gulp.src(jsFiles.concat('static/js/main.js'))
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/js'));
});

gulp.task('restaurant-script', function() {
    return gulp.src(jsFiles.concat('static/js/restaurant_info.js'))
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat('restaurant.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/js'));
});

gulp.task('build', cb => {
    runSequence(
        'clean',
        'css-minify',
        'scripts',
        'restaurant-script',
        'copy-static',
    cb);
});