let gulp = require('gulp');
let browserify = require('browserify');
let source = require('vinyl-source-stream');
let fancy_log = require('fancy-log');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var buffer = require('vinyl-buffer');
let del = require('del');

const paths = {
    html: {
        src: 'src/*.html',
        dest: 'dist/'
    },
    js: {
        src: ['src/main.ts'],
        dest: 'dist/'
    }
};

let brwsrify = browserify({
    debug: true,
    entries: paths.js.src,
    cache: {},
    packageCache: {},
    plugin: ['watchify', 'tsify']
});

brwsrify.on('update', jsbundle);
brwsrify.on('log', fancy_log);

function clean() {
    return del([paths.html.dest + '*']);
}

function html() {
    return gulp.src(paths.html.src, { since: gulp.lastRun(html) })
        .pipe(gulp.dest(paths.html.dest));
}

function watch() {
    gulp.watch(paths.html.src, html);
}

function jsbundle() {
    return brwsrify
        .transform("babelify", {
            presets: ["@babel/preset-env"],
            extensions: ['.ts']
        })
        .bundle()
        .on('error', fancy_log)
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('dist'));
}

exports.clean = clean;
exports.default = gulp.series(html, jsbundle, watch);
