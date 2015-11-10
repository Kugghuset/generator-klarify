'use strict'

/**
 * The flow file for the <%= name %> route.
 * This is where the dbHandler and requestHandler can communicate
 * and is what the index file can and should have access to.
 */

var _ = require('lodash');
var Promise = require('bluebird');

var dbHandler = require('./<%= name %>.dbHandler');
var requestHandler = require('./<%= name %>.requestHandler');

/**
 * Fetches and inserts or updates all <%= nameCapitalized %>s
 * from the <%= dataSource %> API which are new or updated since last time.
 * 
 * @return {Promise} -> undefined
 */
exports.fetchNewlyModified = function () {
  return dbHandler.initializeTable()
  .then(requestHandler.getNewlyModified)
  .then(dbHandler.updateOrInsert);
};

/**
 * Clears the old instance of <%= nameCapitalized %>s
 * and downloads all from the <%= dataSource %> API.
 * 
 * WARNING: This drops the old <%= nameCapitalized %> table
 * and initializes a completely fresh.
 * This will lose all historical data.
 * 
 * @return {Promise} -> undefined
 */
exports.cleanAndFetch = function () {
  return dbHandler.drop()
  .then(dbHandler.initializeTable)
  .then(requestHandler.getAll)
  .then(dbHandler.insertMany);
}

/**
 * Gets all active <%= name %>s from the database.
 * 
 * @return {Promise} -> ([<%= nameCapitalized %>])
 */
exports.getAllActive = function () {
  return dbHandler.initializeTable()
  .then(dbHandler.getActive);
};

/**
 * Gets all active <%= name %>s where
 * StartDate is greater than *date*.
 * 
 * @param {Date} date
 * @return {Promise} -> ([<%= nameCapitalized %>])
 */
exports.getActiveSince = function (date) {
  return dbHandler.initializeTable()
  .then(function (res) { return dbHandler.getActiveSince(date); });
};

/**
 * Gets every <%= name %> in the database.
 * This also returns historical data.
 * 
 * @return {Promise} -> ([<%= nameCapitalized %>])
 */
exports.getAll = function () {
  return dbHandler.initializeTable()
  .then(dbHandler.getAll);
}