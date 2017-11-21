'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _expressWinston = require('express-winston');

var _winston = require('winston');

var _sprintfJs = require('sprintf-js');

class Logger {
  constructor(PopApi, { name, logDir, pretty, quiet }) {
    this._levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    };

    this._name = name;

    this._logDir = logDir;

    global.logger = this._getLogger('winston', pretty, quiet);
    PopApi.expressLogger = this._getLogger('express', pretty, quiet);
  }

  _checkEmptyMessage(args) {
    if (args.message === '' && Object.keys(args.meta).length !== 0) {
      args.message = JSON.stringify(args.meta);
    }

    return args;
  }

  _getLevelColor(level) {
    let color = '\x1b[36m';
    switch (level) {
      case 'error':
        color = '\x1b[31m';
        break;
      case 'warn':
        color = '\x1b[33m';
        break;
      case 'info':
        color = '\x1b[36m';
        break;
      case 'debug':
        color = '\x1b[34m';
        break;
      default:
        color = '\x1b[36m';
        break;
    }

    return color;
  }

  _consoleFormatter(args) {
    const newArgs = this._checkEmptyMessage(args);
    const color = this._getLevelColor(newArgs.level);

    return (0, _sprintfJs.sprintf)(`\x1b[0m[%s] ${color}%5s:\x1b[0m %2s/%d: \x1b[36m%s\x1b[0m`, new Date().toISOString(), newArgs.level.toUpperCase(), this._name, process.pid, newArgs.message);
  }

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

  _createExpressWinston(pretty) {
    return new _expressWinston.logger({
      winstonInstance: this._createWinston(pretty),
      statusLevels: true
    });
  }

  _createLogger(pretty, quiet) {
    const logger = {};

    const winston = this._createWinston(pretty);
    Object.keys(this._levels).map(level => {
      logger[level] = quiet ? () => {} : winston[level].bind(winston);
    });

    return logger;
  }

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