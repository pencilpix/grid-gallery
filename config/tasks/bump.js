import gulp from 'gulp';
import yargs from 'yargs';
import gulpLoadPlugin from 'gulp-load-plugins';
import { DEV_SRC,TASKS } from '../utils.gulp';

const argv = yargs.argv;
const $ = gulpLoadPlugin();

function getVersionArgs(args) {
  if(args.version) {
    return $.bump({version: args.version});
  } else if(args.type) {
    return $.bump({type: args.type});
  } else {
    return $.bump();
  }
}

export const bump = (() => {
  return gulp.task(TASKS.bump, () => {
    gulp.src([DEV_SRC.js, DEV_SRC.sass, '*.json'], {base: './'})
      .pipe(getVersionArgs(argv))
      .pipe(gulp.dest('./'));
  });
})();

