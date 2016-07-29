import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import browserSync from 'browser-sync'
import mochaPhantomJS from 'gulp-mocha-phantomjs'
import del from 'del'

const $ = gulpLoadPlugins()
const reload = browserSync.reload

const lintOptions = {
  rules: {
    'no-console': 1
  }
}

const testLintOptions = {
  rules: {
    'no-undef': 1
  },
  env: {
    mocha: true
  }
}

function lint(files, options) {
  return () => {
    return gulp.src(files)
      .pipe(reload({stream: true, once: true}))
      .pipe($.eslint(options))
      .pipe($.eslint.format())
      .pipe($.if(!browserSync.active, $.eslint.failAfterError()));
  }
}

// styles
gulp.task('styles', () => {
  return gulp.src(['src/assets/sass/*.scss', 'src/assets/sass/*.sass'])
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('dev/assets/css'))
    .pipe(reload({stream: true}))
})

// script
gulp.task('scripts', () => {
  return gulp.src('src/assets/js/**/*.js')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('dev/assets/js'))
    .pipe(reload({stream: true}));
})

// linting
gulp.task('lint', lint('src/assets/js/**/*.js', lintOptions));
gulp.task('lint:test', lint('test/specs/**/*.js', testLintOptions));


gulp.task('test', () => {
    return gulp
      .src('test/index.html')
      .pipe(mochaPhantomJS({
          reporter: 'spec',
          mocha: {colors: true},
          phantomjs: {
            hooks: 'mocha-phantomjs-istanbul',
            coverageFile: './coverage/coverage.json',
            viewportSize: {
                width: 1024,
                height: 768
            },
            useColors:true,
            suppressStdout: true,
            suppressStderr: true
          }
      }))
      .on('finish', function() {
        gulp.src('./coverage/coverage.json')
          .pipe($.istanbulReport())
      });
})

gulp.task('watch:test', ['lint:test'], function(){
  gulp.watch(['src/assets/js/**/*.js', 'test/specs/**/*.js'], ['test'])
})

gulp.task('serve', ['styles', 'scripts'], () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['dev', 'src'],
      routes: {
        '/node_modules': 'node_modules'
      }
    }
  });

  gulp.watch([
    'src/*.html',
    'src/assets/images/**/*'
  ]).on('change', reload);

  gulp.watch(['src/assets/sass/**/*.scss', 'src/assets/sass/**/*.sass'], ['styles']);
  gulp.watch('src/assets/js/**/*.js', ['scripts']);
});

// clean the miss before build
gulp.task('clean', del.bind(null, ['dev', 'dist']));

// build
gulp.task('html', ['styles', 'scripts'], () => {
  return gulp.src('src/*.html')
    .pipe($.useref({searchPath: ['dev', 'src', '.']}))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.css', $.cssnano()))
    .pipe($.if('*.html', $.htmlmin({collapseWhitespace: false})))
    .pipe(gulp.dest('dist'));
});
gulp.task('build', ['lint', 'html'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
