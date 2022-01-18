const { src, dest, task, watch, series, parallel } = require('gulp');

const options = require('./config.js'),
  sass = require('gulp-sass')(require('sass')),
  postcss = require('gulp-postcss'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  browserSync = require('browser-sync').create(),
  cp = require('child_process'),
  changed = require('gulp-changed'),
  critical = require('critical'),
  merge = require('merge-stream'),
  webp = require('gulp-webp'),
  rollup = require('gulp-better-rollup'),
  babel = require('rollup-plugin-babel'),
  resolve = require('rollup-plugin-node-resolve'),
  commonjs = require('rollup-plugin-commonjs'),
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
      require('autoprefixer'),
      require('cssnano')
    ]))
    .pipe(rename('app.css'))
    .pipe(dest(options.paths.styles.dest));
}

function criticalCss() {
  critical.generate({
    base: './',
    src: '_site/index.html',
    css: './assets/css/app.css',
    target: {
      css: './_includes/critical.css',
      uncritical: './assets/css/uncritical.css'
    },
    width: 320,
    height: 480
  });
}

function js() {
  return src(`${options.paths.scripts.src}/*.js`)
    .pipe(rollup({ 
      plugins: [
        babel(), 
        resolve(), 
        commonjs()
      ]},
    'umd'))
    .pipe(dest(options.paths.scripts.dest));
}

function images() {
  const featured = src(options.paths.images.featured)
    .pipe(changed(`${options.paths.images.dest}/featured`))
    .pipe(webp({
        quality: 75,
      }))
    .pipe(dest(`${options.paths.images.dest}/featured`));
  
  const thumbnail = src(options.paths.images.thumbnail)
    .pipe(changed(`${options.paths.images.dest}/thumbs`))
    .pipe(webp({
        quality: 75
      }))
    .pipe(dest(`${options.paths.images.dest}/thumbs`));

  const other = src(options.paths.images.other)
    .pipe(changed(`${options.paths.images.dest}`))
    .pipe(webp({
        quality: 75
      }))
    .pipe(dest(`${options.paths.images.dest}`));
  
  return merge(featured, thumbnail);
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
  watch(`${options.paths.styles.src}/**/*.scss`, series(style, browserSyncReload));
  watch([`${options.paths.scripts.src}`, './gulpfile.js'], series(js, browserSyncReload));
  watch([options.config.tailwind, `${options.paths.styles.src}/**/*.scss`], series(style, browserSyncReload));
  watch(options.paths.images.featured, series(images, browserSyncReload));
  watch(
  [
    '*.html', 
    '_layouts/**/*.html', 
    '_posts/*', 
    '_portfolio/*', 
    '_includes/*',
    '_data/*',
  ],
  series(style, jekyllBuild, browserSyncReload));
}

exports.default = parallel(
  series(style, criticalCss),
  js,
  images,
  jekyllBuild,
  browserSyncServe,
  watchFiles
);

exports.build = parallel(
  series(style, js),
  jekyllBuild
);