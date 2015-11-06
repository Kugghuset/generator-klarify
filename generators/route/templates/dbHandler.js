'use strict'

/**
 * The database handler for the <%= name %> route.
 * It is the interface between the T-SQL code and the requests.
 */

var _ = require('lodash');
var sql = require('seriate');
var Promise = require('bluebird');

var logger = require('../../utils/logger.util');

/**
 * Runs the init script for the model,
 * adding the table to the SQL database if it's non-existent.
 * 
 * @param {Bool} isTemp - optional
 * @return {Promise} -> undefined
 */
exports.initializeTable = function (isTemp) {
  return new Promise(function (resolve, reject) {
    
    var sqlFile = isTemp
      ? './sql/<%= name %>.temp.initialize.sql'
      : './sql/<%= name %>.initialize.sql';
    
    sql.execute({
      query: sql.fromFile(sqlFile)
    })
    .then(function (results) {
      logger.stream.write((isTemp ? '(temp) ' : '') + '<%= name %>.initializeTable resolved.')
      resolve(results);
    })
    .catch(function (err) {
      logger.stream.write((isTemp ? '(temp) ' : '') + '<%= name %>.initializeTable rejected.');
      reject(err);
    });
  });
};

/**
 * Gets the top *limit* or all <%= nameCapitalized %> rows.
 * 
 * @param {Number} limit - optional,  1 <= limit <= 9223372036854775295.
 * @return {Promise} -> {[<%= nameCapitalized %>]}
 */
exports.getAll = function (limit) {
  return new Promise(function (resolve, reject) {
    sql.execute({
      query: sql.fromFile('./sql/<%= name %>.getAll.sql'),
      params: {
        topNum: {
          type: sql.BIGINT,
          val: 0 < limit ? limit : -1
        }
      }
    })
    .then(function (results) {
      logger.stream.write('<%= name %>.getAll resolved.')
      resolve(results);
    })
    .catch(function (err) {
      logger.stream.write('<%= name %>.getAll rejected.')
      reject(err);
    });
  });
};

/**
 * Gets all active <%= name %>s from the db.
 * 
 * @return {Promise} -> {[<%= nameCapitalized %>]}
 */
exports.getActive = function () {
  return new Promise(function (resolve, reject) {
    sql.execute({
      query: sql.fromFile('./sql/<%= name %>.getActive.sql')
    })
    .then(function (results) {
      logger.stream.write('<%= name %>.getActive resolved.')
      resolve(results);
    })
    .catch(function (err) {
      logger.stream.write('<%= name %>.getActive rejected.')
      reject(err);
    });
  });
};

/**
 * Gets all active <%= name %>s where
 * StartDate is greater than *date*.
 * 
 * @param {Date} date
 * @return {Promise} -> {[<%= nameCapitalized %>]}
 */
exports.getActiveSince = function (date) {
  return new Promise(function (resolve, reject) {
    sql.execute({
      query: sql.fromFile('./sql/<%= name %>.getActiveSince.sql'),
      params: {
        dateSince: {
          type: sql.DATETIME2,
          val: date
        }
      }
    })
    .then(function (results) {
      logger.stream.write('<%= name %>.getActiveSince ' + date.toISOString() + ' resolved.')
      resolve(results);
    })
    .catch(function (err) {
      logger.stream.write('<%= name %>.getActiveSince ' + date.toISOString() + ' rejected.')
      reject(err);
    });
  });
};

/**
 * Inserts a new row in the <%= nameCapitalized %> table.
 * If no *<%= name %>* is non-existent or not
 * 
 * @param {Object} <%= name %>
 * @param {Bool} isTemp - optional
 * @return {Promise} -> undefined
 */
exports.insertOne = function (<%= name %>, isTemp) {
  return new Promise(function (resolve, reject) {
    if (!<%= name %> || typeof <%= name %> !== 'object') {
      // return early if no <%= name %> is present.
      logger.stream.write((isTemp ? '(temp) ' : '') + '<%= name %>.insertOne ' + <%= name %>.<%= nameCapitalized %>Number + ' rejected')
      return reject(new TypeError('<%= nameCapitalized %> must be of type "object"'));
    }
    
    var sqlFile = isTemp 
      ? './sql/<%= name %>.temp.insertOne.sql' 
      : './sql/<%= name %>.insertOne.sql';
    
    sql.execute({
      query: sql.fromFile(sqlFile),
      params: {
        url: {
          type: sql.NVARCHAR,
          val: <%= name %>['@url']
        },
        name: {
          type: sql.NVARCHAR(1024),
          val: <%= name %>.Name
        }
      }
    })
    .then(function (result) {
      logger.stream.write((isTemp ? '(temp) ' : '') + '<%= name %>.insertOne ' + <%= name %>.<%= nameCapitalized %>Number + ' resolved.')
      resolve(result);
    })
    .catch(function (err) {
      logger.stream.write((isTemp ? '(temp) ' : '') + '<%= name %>.insertOne ' + <%= name %>.<%= nameCapitalized %>Number + ' rejected.')
      reject(err);
    });
  });
};
/**
 * Recursively inserts one or many <%= name %>s into the <%= nameCapitalized %> table.
 * This is achieved by inserting them one by one.
 * 
 * @param {Array} <%= name %>s ([<%= nameCapitalized %>])
 * @param {Bool} isTemp - optional
 * @param {Array} inserted ([<%= nameCapitalized %>]) - used for recursion, don't set.
 * @return {Promise} -> undefined
 */
exports.insertMany = function insertMany(<%= name %>s, isTemp, inserted) {
  // Set *inserted* to an empty array if it's undefined
  if (!inserted) {
    inserted = [];
    logger.stream.write((isTemp ? '(temp) ' : '') + '<%= name %>.insertMany started.')
  }
  
    // Return if the recursion is finished.
    if (<%= name %>s.length === inserted.length) {
      // SQL INSERTs returns undefined, change this?
      return new Promise(function (resolve, reject) {
        logger.stream.write((isTemp ? '(temp) ' : '') + '<%= name %>.insertMany resolved.')
        resolve(inserted.length);
      });
    }
    
    var lastInserted = <%= name %>s[inserted.length];
    
    return new Promise(function (resolve, reject) {
      exports.insertOne(lastInserted, isTemp)
      .then(resolve)
      .catch(reject);
    })
    .then(function (result) {
      return insertMany(<%= name %>s, isTemp, inserted.concat([lastInserted]));
    })
    .catch(function (err) {
      return new Promise(function (resolve, reject) {
        logger.stream.write((isTemp ? '(temp) ' : '') + '<%= name %>.insertMany rejected.')
        reject(err);
      });
    });
};

/**
 * Updates existing but changed <%= name %>s and inserts new <%= name %>s
 * into the <%= name %> table.
 * 
 * @return {Promise} -> undefined
 */
exports.updateOrInsert = function updateOrInsert(<%= name %>s) {
  return new Promise(function (resolve, reject) {
    new Promise(function (resolve, reject) {
      exports.initializeTable(true)
      .then(function () {
        
        exports.insertMany(<%= name %>s, true)
        .then(resolve);
      })
      .catch(reject);
    })
    .then(function () {
      return new Promise(function (resolve, reject) {
        sql.execute({
          query: sql.fromFile('./sql/<%= name %>.merge.sql')
        })
        .then(function (result) {
          resolve(result);
        })
        .catch(function (err) {
          
          logger.stream.write('<%= name %>.updateOrInsert rejected')
          reject(err);
        });
      });
    })
    .then(function () {
      resolve('');
      
      logger.stream.write('<%= name %>.updateOrInsert resolved')
      
      exports.drop(true)
      .then(resolve);
    });

  });
}

/**
 * Sets a <%= name %> to disabled.
 * 
 * @param {Number} <%= name %>ID
 * @return {Promise} -> undefined
 */
exports.disable = function (<%= name %>ID) {
  return new Promise(function (resolve, reject) {
    sql.execute({
      query: sql.fromFile('./sql/<%= name %>.disabledByID.sql'),
      params: {
        <%= name %>ID: {
          type: sql.BIGINT,
          val: <%= name %>ID
        }
      }
    })
    .then(function (result) {
      logger.stream.write('<%= name %>.disable ' + <%= name %>ID + ' resolved')
      resolve(result);
    })
    .catch(function (err) {
      logger.stream.write('<%= name %>.disable ' + <%= name %>ID + ' rejected')
      reject(err);
    });
  });
}

/**
 * Drops the <%= nameCapitalized %> table.
 * Should really never be used?
 * 
 * @param {Bool} isTemp - optional
 * @return {Promise} -> undefined
 */
exports.drop = function (isTemp) {
  return new Promise(function (resolve, reject) {
    
    var sqlFile = isTemp
      ? './sql/<%= name %>.temp.drop.sql'
      : './sql/<%= name %>.drop.sql';
    
    sql.execute({
      query: sql.fromFile(sqlFile)
    })
    .then(function (result) {
      logger.stream.write((isTemp ? '(temp) ' : '') + '<%= name %>.drop resolved')
      resolve(result);
    })
    .catch(function (err) {
      logger.stream.write((isTemp ? '(temp) ' : '') + '<%= name %>.drop rejected')
      reject(err);
    });
  });
};