'use strict'

var _ = require('lodash');
var ngu = require('normalize-git-url');
var fs = require('fs');
var chalk = require('chalk');

/**
 * Normalizes the git URL
 * Accepts both HTTPS and SSH urls.
 * Returns an ngu object extended with the rawUrl.
 * 
 * @param {String} gitUrl
 * @return {Object} { url: {String}, branch: {String}, rawUrl: {String} }
 */
exports.normalizeGit = function (rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    // Return the an empty object as an ngu like.
    return { url: '', branch: '', rawUrl: rawUrl };
  }

  var git = ngu(rawUrl);
  
  // Clean the url
  git.url = git.url
    .replace(/\.git$/, '') // Remove trailing '.git'
    .replace(/^[a-z]+@|^https:\/\/[a-z]+@/gi, 'https://') // Replace possible git@ or https://username@ with https://
    .replace(/(\.[a-z]+):/, '$1/'); // Replace ':' in the middle with '/', sort of
  
  return _.extend({}, git, { rawUrl: rawUrl });
};

/**
 * Coverts spaces and other non-letters or numbers to PascalCase.
 * 
 * @param {String} input
 * @return {String}
 */
exports.pascalCase = function (input) {
  return _.map(input.split(/[^a-öA-Ö0-9]/), function (subStr) {
    return subStr[0].toUpperCase() + subStr.slice(1);
  }).join('');
}

/**
 * Coverts spaces and other non-letters or numbers to CamelCase.
 * 
 * @param {String} input
 * @return {String}
 */
exports.camelCase = function (input) {
  var pascal = exports.pascalCase(input);
  return pascal[0].toLowerCase() + pascal.slice(1);
}

/**
 * Escapes characters which need escaping in a RegExp.
 * This allows for passing in any string into a RegExp constructor
 * and have it seen as literal
 * 
 * @param {String} text
 * @return {String}
 */
exports.escapeRegex = function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s\/]/g, "\\$&");
};

/**
 * Returns an escaped RegExp object as the literal string *text*.
 * Flags are optional, but can be provided.
 * 
 * @param {String} text
 * @param {String} flags - optional
 * @return {Object} - RegExp object
 */
exports.literalRegExp = function literalRegExp(text, flags) {
  return new RegExp(exports.escapeRegex(text), flags);
}

/**
 * Injects *content* into the file at *destination*
 * between /// Start injection /// and /// Stop injection ///
 * if *content* isn't already present.
 * 
 * @param {Object} yo - yo instance, from generators.(Named)Base.extend used as *this*
 * @param {String} content - text to inject
 * @param {String} destination - filepath, defaults to yo.destinationPath('server/api/routes.js')
 */
exports.injectText = function (yo, content, destination) {
  var fileContents;
  
  destination = destination
    ? destination
    : yo.destinationPath('server/api/routes.js');
    
  // Get the file contents.
  try {
    fileContents = fs.readFileSync(destination, 'utf8');
  } catch (error) {
    console.log(
      '\n' +
      chalk.yellow('Could not find the file at ' + destination + ',\ncould not inject ') +
      chalk.bgYellow(content) +
      '\n'
    );
    // Return early
    return;
  }
  
  // Create regex to match between */// Start injection ///* and */// Stop injection ///*
  var regex = /(\/\/\/\sStart\sinjection\s\/\/\/)([\s\S]*)(?=\/\/\/\sStop\sinjection\s\/\/\/)/i;
  
  // '$1' is the injection start, '$2' is all content after between injection start and stop
  var replace = ['$1$2', content, '\n  '].join('');
  
  if (exports.literalRegExp(content, 'g').test(fileContents)) {
    // It's already there, no need to do anything.
    return;
  }
  
  // Update the file.
  fs.writeFileSync(destination, fileContents.replace(regex, replace));
}