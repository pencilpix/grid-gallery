/**
 * styles task that compiles sass depending on
 * gulp-sass, gulp-plumber, gulp-autoprefixer, and gulp-load-plugins
 */
import gulp from 'gulp';
import gulpLoadPlugin from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import {DEV_SRC, DEV_DEST} from '../utils.gulp';

const $ = gulpLoadPlugin();
const reload = browserSync.reload;

export const sass = (() => {

  return gulp.task('styles', () => {
    return gulp.src(DEV_SRC.sass)
      .pipe($.plumber())
      .pipe($.sourcemaps.init())
      .pipe($.sass.sync({
        outputStyle: 'expanded',
        precision: 10,
        includePaths: ['.']
      }).on('error', $.sass.logError))
      .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest(DEV_DEST.css))
      .pipe(reload({stream: true}));
  });
})();

