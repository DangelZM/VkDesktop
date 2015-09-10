var gulp = require('gulp');
var shell = require('gulp-shell');

var NwBuilder = require('nw-builder');
var nwVersion = '0.12.3';

// Run project
gulp.task('run', shell.task([
  'node node_modules/nw-builder/bin/nwbuild -v ' + nwVersion + ' -r ./'
]));

gulp.task('build', function(cb) {

  var _package = require('./package.json');

  // Find out which modules to include
  var modules = [];
  if (!!_package.dependencies) {
    modules = Object.keys(_package.dependencies)
      .filter(function(m) {
        return m != 'nodewebkit'
      })
      .map(function(m) {
        return '../node_modules/' + m + '/**/*'
      });
  }

  // Which platforms should we build
  var platforms = []
  if (process.argv.indexOf('--win') > -1) platforms.push('win');
  if (process.argv.indexOf('--mac') > -1) platforms.push('osx');
  if (process.argv.indexOf('--linux32') > -1) platforms.push('linux32');
  if (process.argv.indexOf('--linux64') > -1) platforms.push('linux64');

  // Build for All platforms
  if (process.argv.indexOf('--all') > -1) platforms = ['win', 'osx', 'linux32', 'linux64'];

  // If no platform where specified, determine current platform
  if (!platforms.length) {
    if (process.platform === 'darwin') platforms.push('osx');
    else if (process.platform === 'win32') platforms.push('win');
    else if (process.arch === 'ia32') platforms.push('linux32');
    else if (process.arch === 'x64') platforms.push('linux64')
  }

  // Initialize NodeWebkitBuilder
  var nw = new NwBuilder({
    version: nwVersion,
    files: ['./package.json', './src/**/*'].concat(modules),
    platforms: platforms,
    buildType: function(){ return this.appVersion }
  });

  nw.on('log', function(msg) {
    // Ignore 'Zipping... messages
    if (msg.indexOf('Zipping') !== 0) console.log(msg);
  });

  // Build!
  nw.build(function(err) {

    if (!!err) {
      return console.error(err);
    }

    cb(err);
  })
});

gulp.task('default', ['run'], function () {});
