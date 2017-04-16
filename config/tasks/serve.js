import gulp from 'gulp';
import gulpLoadPlugin from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import {DEV_SRC, DEV_DEST, TASKS} from '../utils.gulp';

const $ = gulpLoadPlugin();
const reload = browserSync.reload;

export const serve = (() => {
  return gulp.task(TASKS.serve, [TASKS.sass, TASKS.js], () => {
    browserSync({
      notify: false,
      port: 9000,
      server: {
        baseDir: ['.dev', 'src', '.examples'],
        routes: {
          '/node_modules': 'node_modules'
        }
      }
    });

    gulp.watch([
      '.examples/*.html',
      'src/assets/images/**/*'
    ]).on('change', reload);

    gulp.watch([DEV_SRC.sass], [TASKS.sass]);
    gulp.watch(DEV_SRC.js, [TASKS.js]);
  });

})();

