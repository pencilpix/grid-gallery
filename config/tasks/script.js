/**
 * scripts task compiles es6 usin babel, sourcemaps and gulpload plugins
 */
import gulp from 'gulp';
import gulpLoadPlugin from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import {DEV_SRC, DEV_DEST, BABEL_OPTIONS} from '../utils.gulp';

const $ = gulpLoadPlugin();
const reload = browserSync.reload;

// script
export const scripts = (() => {
  return gulp.task('scripts', () => {
    return gulp.src(DEV_SRC.js)
      .pipe($.plumber())
      .pipe($.sourcemaps.init())
      .pipe($.babel(BABEL_OPTIONS))
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest(DEV_DEST.js))
      .pipe(reload({stream: true}));
  });
})();


