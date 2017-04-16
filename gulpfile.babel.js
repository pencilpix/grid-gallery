import { TASKS } from './config/utils.gulp';

const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const $ = gulpLoadPlugins();
const requireDir = require('require-dir');
const dir = requireDir('./config/tasks');
const del             = require('del');



// TODO: 
// task for linting js
// task for linting test specs

gulp.task('clean', del.bind(null, ['.dev', '.test', 'dist']));

gulp.task('build', [/*'lint',*/ TASKS.minify, TASKS.uglify], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
