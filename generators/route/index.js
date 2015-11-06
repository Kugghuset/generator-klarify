var generators = require('yeoman-generator');
var fs = require('fs');
var path = require('path');

module.exports = generators.NamedBase.extend({
  constructor: function () {
    generators.NamedBase.apply(this, arguments);
  },
  initialize: function () {
    this.log(this.name);
  },
  writing: function () {
    
    // TODO: Append name as file name prefix.
    
    var nameCapitalized = this.name[0].toUpperCase() + this.name.slice(1);
    
    this.fs.copyTpl(
      this.templatePath(),
      this.destinationPath('server/api/' + this.name),
      { name: this.name, nameCapitalized: nameCapitalized }
      );
  }
});