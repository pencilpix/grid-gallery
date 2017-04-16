import gulp from 'gulp';
import gulpLoadPlugin from 'gulp-load-plugins';
import karma from 'karma';
import {DEV_SRC, DEV_DEST, TASKS} from '../utils.gulp';

const $ = gulpLoadPlugin();
const KarmaServer = karma.Server;



// testing
export const test = (() => {
  return gulp.task(TASKS.test, [TASKS.js, TASKS.testJs], (done) => {
    let server =  new KarmaServer({
      configFile: __dirname + '/../../karma.conf.js',
      singleRun: true
    }, done)

    server.on('run_complete', function(){
      gulp.src('test/coverage/**/coverage.json')
        .pipe($.istanbulReport())
    })

    server.start()
  });

})();

export const watchTest = (() => {
  return gulp.task(TASKS.watchTest, function() {
    gulp.watch([DEV_SRC.js, DEV_SRC.specs], [TASKS.test]);
  });
})();



