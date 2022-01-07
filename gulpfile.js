const { src, dest, task, watch, series, parallel } = require('gulp');

const options = require('./config.js'),
    sass = require('gulp-sass')(require('sass')),
    postcss = require('gulp-postcss'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    foreach = require('gulp-flatmap'),
    browserSync = require('browser-sync').create(),
    cp = require('child_process'),
    // autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    changed = require('gulp-changed'),
    critical = require('critical'),
    merge = require('merge-stream'),
    webp = require('gulp-webp'),
    jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';

function jekyllBuild() {
    return cp.spawn( jekyll, ['build'], { stdio: 'inherit' });
}

function style() {
    const tailwindcss = require('tailwindcss');
    return src(`${options.paths.styles.src}/*.scss`)
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('style.scss'))
        .pipe(postcss([
            tailwindcss(options.config.tailwind),
            require('autoprefixer')
        ]))
        .pipe(rename('app.css'))
        .pipe(dest(options.paths.styles.dest))
        .pipe(browserSync.reload({ stream: true }))
        .pipe(notify({ 
            'message': 'Styles task complete' 
        }));
}

function criticalCss() {
    critical.generate({
        base: './',
        src: '_site/index.html',
        css: 'assets/css/app.css',
        target: {
            css: '_includes/critical.css',
            uncritical: '_includes/uncritical.css'
        },
        width: 320,
        height: 480
    });
}

function js() {
    return src(options.paths.scripts.src)
    .pipe(foreach(function(stream, file){
        return stream
            .pipe(uglify())
            .pipe(rename({suffix: '.min'}))
    }))
    .pipe(dest(options.paths.scripts.dest))
    .pipe(browserSync.reload({ stream: true }))
    .pipe(notify({ 
        'message': 'Scripts task complete' 
    }));
}

function browserSyncServe() {
    browserSync.init({
        server: {
            baseDir: './_site/'
        },
        port: 3000
    });
}

function browserSyncReload(done) {
    browserSync.reload();
    done();
}

function watchFiles() {
    watch(['assets/scss/style.scss', 'assets/scss/**/**/*.scss'], style);
    watch(
    [
        '*.html', 
        '_layouts/*.html', 
        '_posts/*', 
        '_portfolio/*', 
        '_includes/*',
        '_data/*',
        'assets/css/*.css',
        'assets/js/*.js',
        'assets/images/*.*'
    ],
    series(jekyllBuild, browserSyncReload));
}

task('default', parallel(jekyllBuild, style, criticalCss, series(js), browserSyncServe, watchFiles));