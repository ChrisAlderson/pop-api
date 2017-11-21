'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _http = require('http');

/**
 * Swap the key-value pairs from the `http.STATUS_CODES` object.
 * @type {Object}
 */
const statusCodes = Object.keys(_http.STATUS_CODES).reduce((acc, current) => {
  const code = parseInt(current, 10);
  const message = _http.STATUS_CODES[code].replace(/'/g, '').replace(/\s+/g, '_').toUpperCase();
  acc[message] = code;

  return acc;
}, {});

/**
 * Export the status codes.
 * @type {Object}
 */
// Import the necessary modules.

exports.default = statusCodes;