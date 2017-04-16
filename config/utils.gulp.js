export const TASKS = {
  sass: 'styles',
  js: 'scripts',
  testJs: 'scripts:test',
  test: 'test',
  watchTest: 'watch:test',
  serve: 'serve',
  build: 'build',
  clean: 'clean',
  minify: 'minify',
  uglify: 'uglify',
  bump: 'bump'
}
/**
 * gulp different builds source paths
 */
// development source path
export const DEV_SRC = {
  sass:   'src/sass/*.sass',
  js:     'src/js/*.js',
  specs:  'test/specs/*.js'
};

// production source path
export const BUILD_SRC = {
  css:   '.dev/css/*.css',
  img:   'src/images/*.*',
  js:    '.dev/js/*.js',
  fonts: 'src/fonts/*.*'
};


/**
 * gulp different builds destination paths
 */
// development destination path
export const DEV_DEST = {
  css:   '.dev/css',
  js:     '.dev/js',
  specs:  '.test'
};


// production destination path
export const BUILD_DEST = {
  css:   'dist/css',
  img:   'dist/images',
  js:    'dist/js',
  fonts: 'dist/fonts/'
};



// gulp-babel options
export const BABEL_OPTIONS = {
  presets: [
    ['es2015', {modules: false}]
  ]
}


// lint options
export const LINT_OPTIONS = {
  rules: {
    'no-console': 1,
    'no-undef': 1
  }
}

export const TEST_LINT_OPTIONS = {
  rules: {
    'no-undef': 1
  }
}

