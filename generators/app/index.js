'use strict'

var Promise = require('bluebird');
var _ = require('lodash');
var ngu = require('normalize-git-url');
var utils = require('./utils');

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

/**
 * Prompts the user for the appName.
 * appName is default to yo.appname, which is the folder name.
 * 
 * @param {Object} yo - yo instance, from generators.(Named)Base.extend used as *this*
 * @return {Promise} -> *yo* - to be chainable
 */
var promptAppName = function (yo) {
  return new Promise(function (resolve, reject) {
    yo.prompt({
      type: 'input',
      name: 'name',
      message: 'What\'s the project name?',
      default: yo.answers.name || yo.appname // Default to current folder name
    }, function (answers) {
      yo.answers = _.extend({}, yo.answers, answers);
      resolve(yo);
    });
  });
};

/**
 * Prompts the user for the author name.
 * 
 * @param {Object} yo - yo instance, from generators.(Named)Base.extend used as *this*
 * @return {Promise} -> *yo* - to be chainable
 */
var promptAuthor = function (yo) {
  return new Promise(function (resolve, reject) {
    
    yo.prompt({
      type: 'input',
      name: 'author',
      message: 'Who\'s the author?',
      default: 'Arthur Dent'
    }, function (answers) {
      yo.answers = _.extend({}, yo.answers, answers);
      resolve(yo);
    });
  });
};

/**
 * Prompts the user for the git repo and cleans the resulting.
 * 
 * @param {Object} yo - yo instance, from generators.(Named)Base.extend used as *this*
 * @return {Promise} -> *yo* - to be chainable
 */
var promptGit = function (yo) {
  return new Promise(function (resolve, reject) {
    
    yo.prompt({
      type: 'input',
      name: 'git',
      message: 'Where\'s the Git repo?'
    }, function (answers) {
      if (answers.git) { answers.git = utils.normalizeGit(answers.git); }
      
      yo.answers = _.extend({}, yo.answers, answers);
      resolve(yo);
    });
  });
}

module.exports = generators.Base.extend({
  // note: arguments and options should be defined in the constructor
  constructor: function () {
    generators.Base.apply(this, arguments);
    
    this.answers = _.extend({}, this.answers, {
      name: (arguments[0] ? 'klarify-ds-' + arguments[0][0] : this.appname),
      version: '0.0.0',
      description: ''
    });
    
    // This method adds support for a '--coffee' flag
    // this.option('coffee');
    // And you can then access it later in this way; e.g.
    // this.scriptSuffix = (this.options.coffee ? '.coffee' : '.js');
    // this.log('We did it with coffeescript? ' + this.scriptSuffix)
  },
  initializing: function () {
    console.log('Initializing');
  },
  paths: function () {
    // console.log(this.git);
    // console.log(this.destinationRoot());
    // console.log(this.sourceRoot());
    // console.log(this.destinationPath('index.js'));
    // console.log(this.templatePath('index.js'));
  },
  prompting: function () {
    var done = this.async();
    
    promptAppName(this, done)
    .then(promptAuthor)
    .then(promptGit)
    .then(function (yo) {
      done();
    })
    .catch(console.log);
  },
  writing: function () {
    console.log(this.answers);
    this.fs.copyTpl(
      this.templatePath(),
      this.destinationPath(),
      this.answers
    )
  },
  installingDependencies: function () {
    this.npmInstall(['bluebird', 'express', 'lodash', 'morgan', 'request', 'seriate', 'winston'], { 'save': true });
    this.npmInstall(['doctoc', 'gulp', 'gulp-exec', 'mocha', 'unit.js'], { 'saveDev': true });
  },
  end: function () {
    console.log('Good bye.');
  }
});