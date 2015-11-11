'use strict'

var Promise = require('bluebird');
var _ = require('lodash');
var utils = require('../utils');
var chalk = require('chalk');
var shell = require('shelljs');
var fs = require('fs');

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
 * Prompts the user for the name of the DataSource
 * 
 * @param {Object} yo - yo instance, from generators.(Named)Base.extend used as *this*
 * @return {Promise} -> *yo* - to be chainable
 */
var promptDataSource = function (yo) {
  return new Promise(function (resolve, reject) {
    yo.prompt({
      type: 'input',
      name: 'dataSource',
      message: 'What\'s the data source name?',
      description: 'If the name needs spaces, as a suggestion use PascalCase for the naming. Any spaces will be removed and converted into PascalCase and the first letter will be capitalized.',
      default: 'DataSource',
      store: true
    }, function (answers) {

      answers.dataSource = utils.pascalCase(answers.dataSource);
      answers.dataSourceCamel = utils.camelCase(answers.dataSource);

      yo.answers = _.extend({}, yo.answers, answers);
      resolve(yo);
    })
  });
}

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
var promptGitUrl = function (yo) {
  return new Promise(function (resolve, reject) {

    yo.prompt({
      type: 'input',
      name: 'git',
      message: 'Where\'s the Git repo located?'
    }, function (answers) {
      if (answers.git) { answers.git = utils.normalizeGit(answers.git); }

      yo.answers = _.extend({}, yo.answers, answers);
      resolve(yo);
    });
  });
};

/**
 * Prompts the user about automatically setting the git repo up in the directory.
 * 
 * @param {Object} yo - yo instance, from generators.(Named)Base.extend used as *this*
 * @return {Promise} -> *yo* - to be chainable
 */
var promptGitInit = function (yo) {
  return new Promise(function (resolve, reject) {
    
    yo.prompt({
      type: 'confirm',
      name: 'gitInit',
      message: 'Do you want to automatically set git up?',
      default: 'Y'
    }, function (answers) {
      
      yo.answers = _.extend({}, yo.answers, answers);
      resolve(yo);
    });
  });
};

/**
 * 
 * Generator starts here.
 * 
 */

module.exports = generators.Base.extend({
  // note: arguments and options should be defined in the constructor
  constructor: function () {
    generators.Base.apply(this, arguments);
    
    this.option('typings')
    
    // Create base for answers so they are guaranteed exist.
    this.answers = _.extend({}, this.answers, {
      name: (arguments[0] ? 'klarify-ds-' + arguments[0][0] : this.appname),
      version: '0.0.0',
      description: ''
    });

  },
  initializing: function () {

    this.log('Initializing Klarify data source project.\n');

  },
  prompting: function () {
    var done = this.async();

    promptAppName(this, done)
      .then(promptDataSource)
      .then(promptAuthor)
      .then(promptGitUrl)
      .then(promptGitInit)
      .then(function (yo) {
        done();
      })
      .catch(this.log);
  },
  configuring: function () {
    // Creates config file.
    this.config.save();
    this.config.set(this.answers);
  },
  writing: function () {
    this.log('Copying files over, please wait.\n');

    this.fs.copyTpl(
      this.templatePath(),
      this.destinationPath(),
      this.answers
      );
    // Copy over .gitignore file
    this.fs.copy(
      this.templatePath('.gitignore'),
      this.destinationPath('.gitignore')
      )
  },
  install: function () {
    this.log('\nInstalling dependencies, please wait.')
    
    var dependencies = ['bluebird', 'express', 'lodash', 'morgan', 'request', 'seriate', 'winston'];
    var devDependencies = ['doctoc', 'gulp', 'gulp-exec', 'mocha', 'unit.js'];
    
    this.npmInstall(dependencies, { 'save': true });
    this.npmInstall(devDependencies, { 'saveDev': true });
    
    if (this.options.typings) {
      if (shell.which('tsd')) {
        this.log('\nInstalling typings');
        this.spawnCommand('tsd', ['install'].concat(dependencies).concat(devDependencies), { 'save': true })
      } else {
        this.log(
          '\n' +
          chalk.red('Cannot install typings automatically because tsd is not install.') 
        );
      }
    }
  },
  end: function () {
    this.log(
      '\nRunning ' +
      chalk.inverse('gulp doc') +
      ' to add table of contents to ' +
      chalk.green('README.md') +
      ' file.\n'
      );

    shell.exec('gulp doc');

    
    if (this.answers.gitInit && shell.which('git')) {
     // git stuff
      this.log(
        '\nRunning ' +
        chalk.inverse('git init') +
        '\n'
        );

      shell.exec('git init');

      var gitIgnore = fs.readFileSync('.gitignore', 'utf8');
      fs.writeFileSync('.gitignore', gitIgnore.replace(/userConfig.js/, ''));
      
      this.log(
        '\nRunning ' +
        chalk.inverse('git add . --all') +
        ' and ' +
        chalk.inverse('git commit -m "Initial commit" -m "Autogenerated by generator-klarify"')
        );
      
      shell.exec('git add . --all');
      shell.exec('git commit -m "Initial commit" -m "Autogenerated by generator-klarify"');
      
      this.log(
        '\nRunning ' +
        chalk.inverse('git update-index --assume-unchanged userConfig.js') +
        ' to ensure the file isn\'t added to the repo.\n'
        );

      shell.exec('git update-index --assume-unchanged userConfig.js');
      
      fs.writeFileSync('.gitignore', gitIgnore);
      
      this.log(
        '\nRunning ' +
        chalk.inverse('git commit -am "Add userConfig.js to gitignore"') +
        '\n'
        );
      
      shell.exec('git commit -am "Add userConfig.js to gitignore"');
    } else if (this.answers.gitInit && !shell.which('git')) {
      this.log(
        '\n' +
        chalk.red('Git must be installed set up the git repo.') +
        '\n'
        );
    }
    
    this.log(
      'Run ' + chalk.inverse('gulp') +
      ' to run start the project.\n\n' +
      chalk.bold.green(this.answers.name) +
      ' is all set up.\n' + 
      'Thank you for using ' +
      chalk.green('generator-klarify') +
      ' and happy coding!\n'
      );
  }
});