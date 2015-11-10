'use strict'

var _ = require('lodash');
var ngu = require('normalize-git-url');

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
