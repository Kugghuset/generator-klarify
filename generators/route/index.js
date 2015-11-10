var generators = require('yeoman-generator');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

/**
 * Combines and returns an url like string
 * by joining the params together.
 * 
 * *basePath* is joined by the others by '/'.
 * All files except 'index.js' or when *skipName* is true
 * will be joined with *routeName*, so the filename will be *routeName*.*fileName*.
 * 
 * Example return:
 *    'server/api/customer/customer.dbHandler.js'
 * or 'server/api/customer/index.js'
 * 
 * @param {String} basePath
 * @param {String} routeName
 * @param {String} fileName
 * @param {Boolean} skipName
 * @return {String} -> path-like string
 */
var createPathName = function (basePath, routeName, fileName, skipName) {
  return _.filter([
    basePath,
    _.filter([ (fileName === 'index.js' || skipName ? '' : routeName), fileName ]).join('.')
  ]).join('/');
};

/**
 * Copies the template file and populates it with template data.
 * *originalPath* is split by '/',
 * and the all but the last element in that list is joined to 'server/api' as the relative path.
 * fileName is assumed to be the last element of split *originalPath*.
 * 
 * @param {Object} yo - yo instance, from generators.(Named)Base.extend used as *this*
 * @param {String} originPath - the path to the template file
 * @param {Object} options - template options for the fs.copyTpl function, should 
 */
var copyTemplate = function (yo, originPath, options) {
  var oPath = originPath.split('/');
  var fileName = oPath.pop();
  var path = ['server/api', yo.name].concat(oPath).join('/');
  yo.fs.copyTpl(
    yo.templatePath(originPath),
    yo.destinationPath(createPathName(path, yo.name, fileName)),
    options
  );
}

/**
 * Recursively copies over all templates
 * and appends the name of the route to each file name.
 * 
 * @param {Object} yo - yo instance, from generators.(Named)Base.extend used as *this*
 * @param {Object} options - template options for the fs.copyTpl function
 * @param {String} _subFolder - optional, the folder name of the folder below templates
 */
var copyTemplateFiles = function copyTemplateFiles(yo, options, _subFolder) {
  var tplPath = _subFolder ? yo.templatePath(_subFolder) : yo.templatePath();
  
  fs.readdirSync(tplPath).forEach(function (pathName) {
    var subFolder = _.filter([_subFolder, pathName]).join('/');
      var statObj = fs.statSync([tplPath, pathName].join('/'));
      if (statObj.isFile()) {
        copyTemplate(this, subFolder, options);
      } else if (statObj.isDirectory()) {
        // Need to go deeper
        return copyTemplateFiles(yo, options, subFolder);
      }
    }.bind(yo));
}

module.exports = generators.NamedBase.extend({
  constructor: function () {
    generators.NamedBase.apply(this, arguments);
    this.answers = this.config.getAll();
  },
  initialize: function () {
    // this.log(this.name);
  },
  writing: function () {
    var nameCapitalized = this.name[0].toUpperCase() + this.name.slice(1);
    copyTemplateFiles(this, _.extend({}, this.answers, { name: this.name, nameCapitalized: nameCapitalized }));
  }
});