'use strict'

var generators = require('yeoman-generator');
var _ = require('lodash');
var chalk = require('chalk');
var fs = require('fs');
var shell = require('shelljs');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);
  },
  initializing: function () {
    this.log('Downloading d.ts files for dependencies and dev-dependencies.');
    
    if (!shell.which('tsd')) {
      this.tsdShellMissing = true;
      
      this.log(
        '\n' + chalk.red('Cannot install d.ts files as command ' +
        chalk.yellow('tsd') + ' is missing.')  +
        '\n\nYou can install it by running ' +
        chalk.inverse('npm install tsd -g') +
        '\nSource: ' + chalk.blue('http://definitelytyped.org/tsd/') + '\n'
        );
    }

  },
  install: function () {
    var done = this.async();
    
    if (this.tsdShellMissing) {
      // If tsd can't be used, there's no installing to be done :(
      return done();
    }
    
    // Try parse the package.json file
    var parsed = _.attempt(function () {
      return JSON.parse(this.fs.read(this.destinationPath('package.json')));
    }.bind(this));
    
    var dependencies = [];
    var devDependencies = [];
    
    if (_.isError(parsed)) {
      this.log(
        chalk.red('Error parsing file at:') + ' ' +
        chalk.yellow(this.destinationPath('package.json')) +
        '\nIs the project initialized?\n'
      );
    } else {
      // Get the dependencies
      dependencies = _.map(parsed.dependencies, function (v, key) { return key; })
      devDependencies = _.map(parsed.devDependencies, function (v, key) { return key; })
      
      this.log('\nRunning ' + chalk.inverse(['tsd install'].concat(dependencies).concat(devDependencies).concat(['--save']).join(' ')) + '\n');
      
      shell.exec(['tsd install'].concat(dependencies).concat(devDependencies).concat(['--save']).join(' '));
      this.tsdInstalled = true;
    }
    done();
  },
  end: function () {
    if (this.tsdInstalled) {
      this.log(
        chalk.green('\nd.ts files installed!\n')
      )
    }
    this.log('Exiting...')
  }
});