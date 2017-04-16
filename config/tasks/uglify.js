import gulp from 'gulp';
import gulpLoadPlugin from 'gulp-load-plugins';
import { BUILD_SRC, BUILD_DEST,TASKS } from '../utils.gulp';


const $ = gulpLoadPlugin();

export const uglify = (() => {
  return gulp.task(TASKS.uglify, [TASKS.sass], () => {
    return gulp.src(BUILD_SRC.css)
      .pipe($.stripCode({
        start_comment: 'strip-code',
        end_comment: 'end-strip-code'
      }))
      .pipe(gulp.dest(BUILD_DEST.css))
      .pipe($.cssnano())
      .pipe($.rename((path) => {
        path.basename += '.min';
        path.extname = '.css';
      }))
      .pipe(gulp.dest(BUILD_DEST.css));
  });

})();

