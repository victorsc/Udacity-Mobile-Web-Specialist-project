const gulp = require('gulp');
const runSequence = require('run-sequence');
const del = require('del');
const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const jpegtran = require('imagemin-jpegtran');
const responsive = require('gulp-responsive');

const jsFiles = [
    'static/js/lazy_loading.js',
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
    gulp.src('static/*')
        .pipe(gulp.dest('public'));
});

gulp.task('css-minify', () => {
    return gulp.src('static/css/*.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest('public/css'));
});

gulp.task('scripts', () => {
    return gulp.src(jsFiles.concat('static/js/main.js'))
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/js'));
});

gulp.task('restaurant-script', () => {
    return gulp.src(jsFiles.concat('static/js/restaurant_info.js'))
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat('restaurant.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/js'));
});

gulp.task('images', () => {
    gulp.src('static/img/**/*')
        .pipe(imagemin({
            progressive: true,
            use: [jpegtran()]
        }))
        .pipe(responsive({
            '*.jpg': [{
              width: 300,
              rename: { suffix: '_300' },
            }, {
              width: 800,
              rename: { suffix: '_800' }
            }],
          }, {
            quality: 70,
            progressive: true,
            errorOnUnusedImage: false
          }))
        .pipe(gulp.dest('public/img'));
});

gulp.task('build', cb => {
    runSequence(
        'clean',
        'css-minify',
        'scripts',
        'restaurant-script',
        'copy-static',
        'images',
        cb);
});