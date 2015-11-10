'use strict'

var winston = require('winston');
var Promise = require('bluebird');

winston.emitErrs = true;

/**
 * Winston Logger instance.
 * Adds logging to console which is:
 *    - Colorized
 *    - Timestamped
 */
var logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true,
            timestamp: true
        })
    ],
    exitOnError: false
});

var stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};

/**
 * Works as a middelware in promise chains.
 * Logs either the type of *params* or *message*.
 * 
 * @param {Object|Any} params
 * @param {String} message
 * @return {Promise} -> *params*
 */
var promise = function (params, message) {
  return new Promise(function (resolve, reject) {
    if (!message) { message = '' + typeof(params) + ' resolved.' };
    
    stream.write(message);
    
    resolve(params);
  });
}

module.exports = logger;
module.exports.stream = stream;
module.exports.promise = promise;