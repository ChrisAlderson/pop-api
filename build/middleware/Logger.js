'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _expressWinston = require('express-winston');

var _winston = require('winston');

var _sprintfJs = require('sprintf-js');

/**
 * Class for setting up the logger.
 * @type {Logger}
 */

/**
 * a multi-transport async logging library for node.js
 * @external {Winston} https://github.com/winstonjs/winston
 */
// Import the necessary modules.
class Logger {

  /**
   * Create a new Logger object.
   * @param {!PopApi} PopApi - The PopApi instance to bind the logger to.
   * @param {!Ojbect} options - The options for the logger.
   * @param {!name} options.name - The name of the log file.
   * @param {?string} [options.type] - The choice for the logger object.
   * @param {?boolean} [options.pretty] - Pretty output with Winston logging.
   * @param {?boolean} [options.quiet] - No output.
   */


  /**
   * The name of the log file.
   * @type {string}
   */
  constructor(PopApi, { name, logDir, type, pretty, quiet }) {
    /**
     * The log levels Winston will be using.
     * @type {Object}
     */
    this._levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
      /**
       * The name of the log file.
       * @type {string}
       */
    };this._name = name;
    /**
     * The directory where the log file will be stored.
     * @type {string}
     */
    this._logDir = logDir;

    if (type === 'winston') {
      global.logger = this._getLogger('winston', pretty, quiet);
    } else if (type === 'express') {
      PopApi.expressLogger = this._getLogger('express', pretty, quiet);
    } else {
      throw new Error('');
    }
  }

  /**
   * Check if the message is empty and replace it with the meta.
   * @param {!Object} args - Arguments passed by Winston.
   * @returns {Object} - Formatter arguments passed by Winston.
   */


  /**
   * The directory where the log file will be stored.
   * @type {string}
   */


  /**
   * The log levels Winston will be using.
   * @type {Object}
   */
  _checkEmptyMessage(args) {
    if (args.message === '' && Object.keys(args.meta).length !== 0) {
      args.message = JSON.stringify(args.meta);
    }

    return args;
  }

  /**
   * Get the color of the output based on the log level.
   * @param {?string} [level] - The log level.
   * @returns {string} - A color based on the log level.
   */
  _getLevelColor(level) {
    switch (level) {
      case 'error':
        return '\x1b[31m';
      case 'warn':
        return '\x1b[33m';
      case 'info':
        return '\x1b[36m';
      case 'debug':
        return '\x1b[34m';
      default:
        return '\x1b[36m';
    }
  }

  /**
   * Formatter method which formats the output to the console.
   * @param {!Object} args - Arguments passed by Winston.
   * @returns {string} - The formatted message.
   */
  _consoleFormatter(args) {
    const newArgs = this._checkEmptyMessage(args);
    const color = this._getLevelColor(newArgs.level);

    return (0, _sprintfJs.sprintf)(`\x1b[0m[%s] ${color}%5s:\x1b[0m %2s/%d: \x1b[36m%s\x1b[0m`, new Date().toISOString(), newArgs.level.toUpperCase(), this._name, process.pid, newArgs.message);
  }

  /**
   * Formatter method which formats the output to the log file.
   * @param {!Object} args - Arguments passed by Winston.
   * @returns {string} - The formatted message.
   */
  _fileFormatter(args) {
    const newArgs = this._checkEmptyMessage(args);
    return JSON.stringify({
      name: this._name,
      pid: process.pid,
      level: newArgs.level,
      msg: newArgs.message,
      time: new Date().toISOString()
    });
  }

  /**
   * Create a Winston instance.
   * @param {?boolean} [pretty] - Pretty mode for output with colors.
   * @returns {Winston} - A configured Winston object.
   */
  _createWinston(pretty) {
    const { Console, File } = _winston.transports;

    const f = pretty ? _winston.format.printf(this._consoleFormatter.bind(this)) : _winston.format.simple();

    return (0, _winston.createLogger)({
      levels: this._levels,
      transports: [new Console({
        name: this._name,
        format: f
      }), new File({
        filename: (0, _path.join)(...[this._logDir, `${this._name}.log`]),
        format: _winston.format.printf(this._fileFormatter.bind(this)),
        maxsize: 5242880,
        handleExceptions: true
      })],
      exitOnError: false
    });
  }

  /**
   * Create an Express Winston instance.
   * @param {?boolean} [pretty] - Pretty mode for output with colors.
   * @returns {ExpressWinston} - A configured Express Winston object.
   */
  _createExpressWinston(pretty) {
    return new _expressWinston.logger({
      winstonInstance: this._createWinston(pretty),
      expressFormat: true
    });
  }

  /**
   * Method to create a global logger object based on the properties of the
   * Logger class.
   * @param {?boolean} [pretty] - Pretty mode for output with colors.
   * @param {?boolean} [quiet] - No output.
   * @returns {Object} - A configured logger.
   */
  _createLogger(pretty, quiet) {
    const logger = {};

    const winston = this._createWinston(pretty);
    Object.keys(this._levels).map(level => {
      logger[level] = quiet ? () => {} : winston[level].bind(winston);
    });

    return logger;
  }

  /**
   * Get a logger object based on the choice.
   * @param {?string} [type] - The choice for the logger object.
   * @param {?boolean} [pretty] - Pretty output with Winston logging.
   * @param {?boolean} [quiet] - No output.
   * @returns {ExpressWinston|undefined} - The logger object.
   */
  _getLogger(type, pretty, quiet) {
    if (!type) {
      return undefined;
    }

    const t = type.toUpperCase();

    switch (t) {
      case 'EXPRESS':
        return this._createExpressWinston(pretty);
      case 'WINSTON':
        return this._createLogger(pretty, quiet);
      default:
        return undefined;
    }
  }

}
exports.default = Logger;
/**
 * express.js middleware for winstonjs
 * @external {ExpressWinston} https://github.com/bithavoc/express-winston
 */