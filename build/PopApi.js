'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cluster = require('cluster');

var _path = require('path');

var _middleware = require('./middleware');

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const defaultLogDir = (0, _path.join)(...[__dirname, '..', 'tmp']);

class PopApi {
  static async init({
    controllers,
    name,
    version,
    logDir = defaultLogDir,
    hosts = ['localhost'],
    dbPort = 27017,
    username,
    password,
    serverPort = process.env.PORT,
    workers = 2
  }) {
    const { app } = PopApi;
    if (_cluster.isMaster) {
      await utils.createTemp(logDir);
    }

    PopApi.use(_middleware.Cli, {
      argv: process.argv,
      name,
      version
    });

    const loggerOpts = _extends({
      name,
      logDir
    }, PopApi.loggerArgs);
    PopApi.use(_middleware.Logger, loggerOpts);
    PopApi.use(_middleware.Database, {
      database: name,
      hosts,
      username,
      password,
      port: dbPort
    });
    PopApi.use(_middleware.HttpServer, {
      app,
      workers,
      port: serverPort
    });
    PopApi.use(_middleware.Routes, {
      app,
      controllers
    });

    await PopApi.database.connect();

    return PopApi;
  }

  static use(Plugin, ...args) {
    if (PopApi._installedPlugins.has(Plugin)) {
      return this;
    }

    const plugin = typeof Plugin === 'function' ? new Plugin(this, ...args) : null;

    if (plugin) {
      PopApi._installedPlugins.set(Plugin, plugin);
    }

    return this;
  }

}
exports.default = PopApi;
PopApi.app = (0, _express2.default)();
PopApi._installedPlugins = new Map();