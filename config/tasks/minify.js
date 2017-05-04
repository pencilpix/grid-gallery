import gulp from 'gulp';
import gulpLoadPlugin from 'gulp-load-plugins';
import { BUILD_SRC, BUILD_DEST,TASKS } from '../utils.gulp';


const $ = gulpLoadPlugin();

export const minify = (() => {
  return gulp.task(TASKS.minify, [TASKS.js], () => {
    return gulp.src(BUILD_SRC.js)
      .pipe($.stripCode({
        start_comment: 'strip-code',
        end_comment: 'end-strip-code'
      }))
      .pipe(gulp.dest(BUILD_DEST.js))
      // .pipe($.uglify())
      // .pipe($.rename((path) => {
        // path.basename += '.min';
        // path.extname = '.js';
      // }))
      .pipe(gulp.dest(BUILD_DEST.js));
  });

})();

