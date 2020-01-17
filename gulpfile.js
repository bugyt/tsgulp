let gulp = require('gulp');
let browserify = require('browserify');
let source = require('vinyl-source-stream');
let fancy_log = require('fancy-log');
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
    plugin: ['watchify'],
    transform: ['tscriptify'],
    extensions: ['.ts']
});

brwsrify.on('update', bundle);
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

function bundle() {
    return brwsrify
        .bundle()
        .on('error', fancy_log)
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('dist'));
}

exports.clean = clean;
exports.default = gulp.series(html, bundle, watch);
