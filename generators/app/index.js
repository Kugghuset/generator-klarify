'use strict'


/**
 * 
 * NOTE: This file is just a test file and shuold be modified.
 * 
 * The route folder is mostly done.
 * 
 * 
 */





/**
 * Priority order: http://yeoman.io/authoring/running-context.html
 */

var generators = require('yeoman-generator');

module.exports = generators.Base.extend({
  // note: arguments and options should be defined in the constructor
  constructor: function () {
    generators.Base.apply(this, arguments);
    
    // This method adds support for a '--coffee' flag
    this.option('coffee');
    // And you can then access it later in this way; e.g.
    this.scriptSuffix = (this.options.coffee ? '.coffee' : '.js');
    this.log('We did it with coffeescript? ' + this.scriptSuffix)
  },
  initializing: function () {
    console.log('Initializing');
  },
  // installingDependencies: function () {
  //   this.npmInstall(['lodash', 'bluebird', 'seriate'], { 'save': true })
  // },
  paths: function () {
    console.log(this.destinationRoot());
    console.log(this.sourceRoot());
    console.log(this.destinationPath('index.js'));
    console.log(this.templatePath('index.js'));
  },
  prompting: function () {
    var done = this.async();
    
    this.prompt({
      type: 'input',
      name: 'name',
      message: 'Your project name',
      default: this.appname // Default to current folder name
    }, function (answers) {
      this.log(answers.name);
      done();
    }.bind(this));
  },
  writing: function () {
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('public/index.hml'),
      { title: 'Templating with Yeoman' }
    )
  },
  end: function () {
    console.log('Good bye.');
  }
});