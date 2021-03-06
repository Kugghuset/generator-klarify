'use strict'

/**
 * The request handler file for the <%= name %> route.
 * This is where requests to the <%= dataSource %> API are made.
 */

var _ = require('lodash');
var Promise = require('bluebird');
var request = require('request');

var config = require('../../config/environment/development');
var appState = require('../../app.state');
var logger = require('../../utils/logger.util');

var baseUrl = 'https://insert.url';

/**
 * Returns a promise of the body of the response.
 * 
 * @param {String} url
 * @return {Promise} -> {Object}
 */
function getPage(url) {
  return new Promise(function (resolve, reject) {
    request.get({
      uri: url, 
      headers: _.extend(
        {},
        config.headers.standard,
        { 'Media-Type': 'application/x-www-form-urlencoded' }
      )
    }, function (err, res, body) {
      if (err) {
        reject(err); // Something went wrong with the request...
      } else {
        try {
          logger.stream.write('<%= name %>.getPage ' + url + ' resolved')
          resolve(JSON.parse(body));
        } catch (error) {
          logger.stream.write('<%= name %>.getPage ' + url + ' rejected')
          reject(err);
        }
      }
    });
  });
}

/**
 * Recursively gets all <%= nameCapitalized %>s from <%= dataSource %>.
 * 
 * @param {Array} <%= name %> - set internally, do not pass in!
 * @param {Number} currentPage - set internally, do not pass in!
 * @param {Number} lastPage - set internally, do not pass in!
 * @return {Promise} -> ([<%= nameCapitalized %>])
 */
exports.getAll = function getAll(<%= name %>, currentPage, lastPage) {
  
  // Setup for recursive calls
  if (!<%= name %>) {
    <%= name %> = [];
    currentPage = 0;
  }
  
  // NOTE: Change this to fit for <%= dataSource %>'s API
  if (currentPage >= lastPage) {
    // Finished getting all <%= nameCapitalized %>s
    return new Promise(function (resolve, reject) {
      
      // Actual return of the function
      appState.setUpdated('<%= nameCapitalized %>')
      .then(function () {
        logger.stream.write('<%= name %>.getAll resolved')
        resolve(<%= name %>); // This is returned.
      })
      .catch(function (err) {
        logger.stream.write('<%= name %>.getAll rejected')
        reject(err);
      });
    });
  }
  
  currentPage++;
  // NOTE: Change this to account for pagination
  return getPage(baseUrl)
  .then(function (res) {
    // NOTE: Change this to account for error responses in <%= dataSource %>
    if ('ErrorInformation' in res) {
      // Reject the because of the error to ensure no infinity loop.
      return new Promise(function (resolve, reject) {
        // NOTE: Change thsi to display actual error message.
        reject(new Error('Something went wrong with the request'));
      });
    }
    // NOTE: Change this to account for pagination
    if (typeof lastPage === 'undefined') {
      lastPage = currentPage; // NOTE: Change this
    }
    
    return getAll(<%= name %>.concat(res.<%= nameCapitalized %>s), currentPage, lastPage)
  });
};

/**
 * Gets all <%= nameCapitalized %>s which are updated or created since the last time updated.
 * 
 * @param {Array} <%= name %> - set internally, do not pass in!
 * @param {Number} currentPage - set internally, do not pass in!
 * @param {Number} lastPage - set internally, do not pass in!
 * @param {Date} lastUpdated - set internally, do not pass in!
 * @return {Promise} -> ([<%= nameCapitalized %>])
 */
exports.getNewlyModified = function getNewlyModified(<%= name %>, currentPage, lastPage, lastUpdated) {

  // Setup for recursive calls
  if (!<%= name %>) {
    <%= name %> = [];
    currentPage = 0;
  }

  // Check if it's finished
  if (currentPage >= lastPage) {
    return new Promise(function (resolve, reject) {
      // Actual return of the function
      appState.setUpdated('<%= nameCapitalized %>')
      .then(function (rs) {
        logger.stream.write('<%= name %>.getNewlyModified (' + lastUpdated + ') resolved')
        resolve(<%= name %>) // This is the return
      })
      .catch(function (err) {
        logger.stream.write('<%= name %>.getNewlyModified (' + lastUpdated + ') rejected')
        reject(err);
      });
    });
  }
  
  return new Promise(function (resolve, reject) {
    // Check if lastUpdated already is defined
    if (typeof lastUpdated !== 'undefined') {
      return resolve(lastUpdated);
    }
    
    // Get lastUpdated from db
    appState.getCurrentState('<%= nameCapitalized %>')
    .then(function (currentState) {
      if (currentState[0] !== null && typeof currentState[0] === 'object') {
        resolve(currentState[0].DateUpdated);
      } else {
        // There is no lastUpdated, but it's not date last updated
        resolve(null);
      }
    })
    .catch(function (err) {
      reject(err);
    });
  })
  .then(function (dateUpdated) {
    lastUpdated = dateUpdated;
    currentPage++;
      
    return getPage(baseUrl);
  })
  .then(function (res) {
    if ('ErrorInformation' in res) {
      // Reject the because of the error to ensure no infinity loop.
      return new Promise(function (resolve, reject) {
        // NOTE: Change thsi to display actual error message.
        reject(new Error('Something went wrong with the request'));
      });
    }
    // NOTE: Change this to account for pagination
    if (typeof lastPage === 'undefined') {
      lastPage = currentPage; // NOTE: Change this
    }
    
    // Recursion!
    return getNewlyModified(<%= name %>.concat(res.<%= nameCapitalized %>s), currentPage, lastPage, lastUpdated);
  });

};
