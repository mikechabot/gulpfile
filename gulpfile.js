var gulp = require('gulp');

var express = require('express');
var liveReload = require('tiny-lr');
var typescript = require('gulp-typescript');

gulp.task('express', function() {
  var app = express();
  app.use(require('connect-livereload')({port: 35729}));
  app.use(express.static(__dirname));
  app.listen(4000, '0.0.0.0');
});

gulp.task('watch', function() {
  gulp.watch('app/*.ts', notifyLiveReload);
  gulp.watch('*.html', notifyLiveReload);
  gulp.watch('css/*.css', notifyLiveReload);
});

var tinylr;
gulp.task('livereload', function() {
    tinylr = liveReload();
    tinylr.listen(35729);
});

function isTypeScript(path) {
  return path.indexOf('.ts') !== -1;
}

function compileTypeScript() {
  console.log('Compiling TypeScript');
  gulp.src(['app/*.ts']).pipe(typescript()).js.pipe(gulp.dest('app'))  
}

function notifyLiveReload(event) {

  if (isTypeScript(event.path)) {
    compileTypeScript();
  }

  var fileName = require('path').relative(__dirname, event.path);
  tinylr.changed({
    body: {
      files: [fileName]
    }
  });
}


gulp.task('default', ['express', 'livereload', 'watch'], function() {});