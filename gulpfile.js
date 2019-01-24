var gulp = require('gulp'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    merge = require('merge-stream'),
    foreach = require('gulp-flatmap'),
    browserSync = require('browser-sync').create(),
    cp = require('child_process'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    cmq = require('css-mqpacker'),
    jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';

var plugins = [
    autoprefixer,
    cssnano,
    cmq
]

var paths = {
    styles: {
        src: 'assets/scss/style.scss',
        dest: 'assets/css'
    },
    scripts: {
        src: [
            'node_modules/jquery/dist/jquery.slim.js',
            'node_modules/bootstrap/dist/js/bootstrap.js',
            'node_modules/popper.js/dist/umd/popper.js',
            'node_modules/now-ui-kit/assets/js/now-ui-kit.js',
            'node_modules/mixitup/dist/mixitup.js',
            'node_modules/magnific-popup/dist/jquery.magnific-popup.js',
            'node_modules/lazysizes/lazysizes.js'
        ],
        dest: 'assets/js'
    }
};

function jekyllBuild() {
    return cp.spawn( jekyll, ['build'], {stdio: 'inherit'})
}

function style() {
    var cssStream = gulp.src('node_modules/magnific-popup/dist/magnific-popup.css')
        .pipe(concat('magnific-popup.css'));

    var sassStream = gulp.src(paths.styles.src)
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(concat('app.scss'));
    
    var mergeStream = merge(sassStream, cssStream)
        .pipe(concat('app.css'))
        .pipe(postcss(plugins))
        .pipe(rename('app.css'))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(browserSync.stream({match: '**/*.css'}))
        .pipe(notify({ message: 'Styles task complete' }));
    
    return mergeStream;
}

function js() {
    return gulp.src(paths.scripts.src)
    .pipe(foreach(function(stream, file){
        return stream
            .pipe(uglify())
            .pipe(rename({suffix: '.min'}))
    }))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.reload({stream:true}))
    .pipe(notify({ message: 'Scripts task complete' }));
}

function browserSyncServe(done) {
    browserSync.init({
        injectChanges: true,
        server: {
            baseDir: '_site'
        }
    })
    done();
}

function browserSyncReload(done) {
    browserSync.reload();
    done();
}

function watch() {
    gulp.watch(paths.styles.src, style).on('change', browserSync.reload)
    gulp.watch(paths.scripts.src, js)
    gulp.watch(
    [
        '*.html', 
        '_layouts/*.html', 
        '_posts/*', 
        '_portfolio/*', 
        '_includes/*'
    ],
    gulp.series(jekyllBuild, browserSyncReload));
}

gulp.task('default', gulp.parallel(jekyllBuild, style, js, browserSyncServe, watch))