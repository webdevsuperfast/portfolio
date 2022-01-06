const { src } = require('gulp');

var gulp = require('gulp'),
    sass = require('gulp-sass')(require('sass')),
    postcss = require('gulp-postcss'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    foreach = require('gulp-flatmap'),
    browserSync = require('browser-sync').create(),
    cp = require('child_process'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    changed = require('gulp-changed'),
    critical = require('critical'),
    merge = require('merge-stream'),
    webp = require('gulp-webp'),
    jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';

var plugins = [
    autoprefixer,
    cssnano({
        preset: ['default', {
            discardComments: {
                removeAll: true,
            },
        }]
    })
]

// sass.compiler = require('sass');

var styles,
    scripts,
    images,
    sources;

styles = {}
scripts = {}
images = {}
sources = {}

styles.src = 'assets/scss/style.scss';
styles.dest = 'assets/css';

scripts.src = [
    'node_modules/stream/assets/vendors/bootstrap/js/bootstrap.js',
    'node_modules/stream/assets/js/global.js',
    'node_modules/stream/assets/vendors/jquery.parallax.js',
    'node_modules/stream/assets/js/vendors/parallax.js',
    'node_modules/mixitup/dist/mixitup.js',
    'node_modules/magnific-popup/dist/jquery.magnific-popup.js',
    'node_modules/vanilla-lazyload/dist/lazyload.js'
];
scripts.minified = [
    'node_modules/stream/assets/vendors/popper.min.js',
    'node_modules/stream/assets/vendors/jquery.min.js',
    'node_modules/stream/assets/vendors/jquery.migrate.min.js',
    'node_modules/stream/assets/vendors/jquery.back-to-top.min.js'
];
scripts.dest = 'assets/js';

images.feature = [
    './develop/images/*.{jpg,png}',
    '!./develop/images/school-for-selling.jpg',
    '!./develop/images/*.svg',
    '!./develop/images/thumbs/*.{jpg,png}'
];
images.thumbnail = [
    './develop/images/thumbs/*'
];

sources.src = 'node_modules/stream/assets/include/scss/**/**';
sources.dest = 'assets/scss/sources/';

function jekyllBuild() {
    return cp.spawn( jekyll, ['build'], { stdio: 'inherit' });
}

function style() {
    return gulp.src(styles.src)
        .pipe(changed(styles.dest))
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('app.scss'))
        .pipe(postcss(plugins))
        .pipe(rename('app.css'))
        .pipe(gulp.dest(styles.dest))
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

function fonts() {
    var fontAwesome = gulp.src('./node_modules/@fortawesome/fontawesome-free/webfonts/*')
        .pipe(changed('assets/fonts/font-awesome'))
        .pipe(gulp.dest('assets/fonts/font-awesome'));
    
    return merge(fontAwesome);

}

function js() {
    return gulp.src(scripts.src)
    .pipe(foreach(function(stream, file){
        return stream
            .pipe(uglify())
            .pipe(rename({suffix: '.min'}))
    }))
    .pipe(gulp.dest(scripts.dest))
    .pipe(browserSync.reload({ stream: true }))
    .pipe(notify({ 
        'message': 'Scripts task complete' 
    }));
}

function jsMinified() {
    return gulp.src(scripts.minified)
        .pipe(changed(scripts.dest))
        .pipe(gulp.dest(scripts.dest))
        .pipe(browserSync.reload({ stream: true }))
        .pipe(notify({
            'message': 'Minified scripts task complete' 
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

function watch() {
    gulp.watch(['assets/scss/style.scss', 'assets/scss/**/**/*.scss'], style);
    gulp.watch(
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
    gulp.series(jekyllBuild, browserSyncReload));
}

gulp.task('default', gulp.parallel(jekyllBuild, fonts, style, criticalCss, gulp.series(js, jsMinified), browserSyncServe, watch));