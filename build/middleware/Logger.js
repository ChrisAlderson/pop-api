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

  _getLevelColor(level = 'info') {
    const colors = {
      error: '\x1b[31m',
      warn: '\x1b[33m',
      info: '\x1b[36m',
      debug: '\x1b[34m'
    };

    return colors[level];
  }

  _consoleFormatter(args) {
    const { level, message } = this._checkEmptyMessage(args);
    const color = this._getLevelColor(level);

    return (0, _sprintfJs.sprintf)(`\x1b[0m[%s] ${color}%5s:\x1b[0m %2s/%d: \x1b[36m%s\x1b[0m`, new Date().toISOString(), level.toUpperCase(), this._name, process.pid, message);
  }

  _fileFormatter(args) {
    const { level, message } = this._checkEmptyMessage(args);
    return JSON.stringify({
      name: this._name,
      pid: process.pid,
      level,
      msg: message,
      time: new Date().toISOString()
    });
  }

  _createWinston(suffix, pretty) {
    const { Console, File } = _winston.transports;
    const f = pretty ? _winston.format.printf(this._consoleFormatter.bind(this)) : _winston.format.simple();
    const id = `${this._name}-${suffix}`;

    return _winston.loggers.add(id, {
      levels: this._levels,
      level: 'debug',
      exitOnError: false,
      transports: [new Console({
        name: this._name,
        format: f
      }), new File({
        level: 'warn',
        filename: (0, _path.join)(...[this._logDir, `${id}.log`]),
        format: _winston.format.printf(this._fileFormatter.bind(this)),
        maxsize: 5242880,
        handleExceptions: true
      })]
    });
  }

  _createExpressWinston(pretty) {
    const winstonInstance = this._createWinston('express', pretty);
    return (0, _expressWinston.logger)({
      winstonInstance,
      statusLevels: true
    });
  }

  _createLogger(pretty, quiet) {
    const logger = this._createWinston('app', pretty);

    if (quiet) {
      Object.keys(this._levels).map(level => {
        logger[level] = () => {};
      });
    }

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