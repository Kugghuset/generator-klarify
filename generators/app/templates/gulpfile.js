'use strict'

var gulp = require('gulp');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var gexec = require('gulp-exec');

var node; // Will be the node command.

// Runs the server function via a custom nodemon.
gulp.task('server', function () {
  // Kill node if it's running already.
  if (node) { node.kill() };
  
  // Run a node client on server/app.js
  node = spawn('node', ['server/app.js'], { stdio: 'inherit' });
  
  // If it closes with the error code 8, something crashed
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
});

/**
 * Updates the table of contents for the README.
 */
gulp.task('doc', function () {
  // NOTE: doctoc needs to be installed, see README.md
  gulp.src('./README.md')
    .pipe(gexec('doctoc .'));
});

/**
 * Runs the git assume unchanged command.
 */
gulp.task('assume-unchanged', function () {
  // NOTE: git needs to be installed.
  gulp.src('./userConfig.js')
    .pipe(gexec('git update-index --assume-unchanged userConfig.js'));
});

// Watchers
gulp.task('watch', function () {
  gulp.watch(['./server/**'], ['server']);
});

// Default task
gulp.task('default', ['server', 'watch']);

// On process close, clean up.
process.on('exit', function () {
  if (node) node.kill();
})