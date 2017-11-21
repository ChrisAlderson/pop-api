'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _http = require('http');

const statusCodes = Object.keys(_http.STATUS_CODES).reduce((acc, current) => {
  const code = parseInt(current, 10);
  const message = _http.STATUS_CODES[code].replace(/'/g, '').replace(/\s+/g, '_').toUpperCase();
  acc[message] = code;

  return acc;
}, {});

exports.default = statusCodes;