'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // Import the necessary modules.

/**
 * Fast, unopinionated, minimalist web framework for node.
 * @external {Express} https://github.com/expressjs/express
 */


var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _middleware = require('./middleware');

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * The PopApi class with the middleware pattern.
 * @type {PopApi}
 */
class PopApi {

  /**
   * The setup for the base framework.
   * @param {!Object} options - The options for the framework.
   * @param {!Array<Object>} options.controllers - The controllers to register.
   * @param {!string} options.name - The name for your API.
   * @param {!string} options.version - The version of your API.
   * @param {?boolean} [options.pretty] - Pretty logging output.
   * @param {?boolean} [options.quiet] - No logging output.
   * @param {?Array<string>} [options.hosts] - The hosts of the database
   * cluster.
   * @param {?number} [options.dbPort] - The port the database is on.
   * @param {?string} [options.username] - The username for the database
   * connection.
   * @param {?string} [options.password] - The password for the database
   * connection.
   * @param {?number} [options.serverPort] - The port the API will run on.
   * @param {?number} [options.workers] - The number of workers for the API.
   * @returns {undefined}
   */


  /**
   * The database connection.
   * @type {Database}
   */


  /**
   * The Express instance for the PopApi framework.
   * @type {Express}
   */
  static async init({
    controllers,
    name,
    version,
    pretty,
    quiet,
    hosts = ['localhost'],
    dbPort = 27017,
    username,
    password,
    serverPort = process.env.PORT,
    workers = 2
  }) {
    const { app } = PopApi;
    const logDir = (0, _path.join)(...[__dirname, '..', 'tmp']);
    await utils.createTemp(logDir);

    PopApi.use(_middleware.Cli, {
      argv: process.argv,
      name,
      version
    });

    const loggerOpts = _extends({
      name,
      logDir,
      pretty,
      quiet
    }, PopApi.loggerArgs);
    PopApi.use(_middleware.Logger, _extends({
      type: 'winston'
    }, loggerOpts));
    PopApi.use(_middleware.Logger, _extends({
      type: 'express'
    }, loggerOpts));
    PopApi.use(_middleware.Database, {
      database: name,
      hosts,
      username,
      password,
      port: dbPort
    });
    PopApi.use(_middleware.Server, {
      app,
      workers,
      port: serverPort
    });
    PopApi.use(_middleware.Routes, {
      app,
      controllers
    });

    await PopApi.connection.connectMongoDb();

    return PopApi;
  }

  /**
   * Register middleware for the PopApi framework.
   * @param {!Function} Plugin - The plugin to use.
   * @param {!Object} args - The arguments passed down to the constructor of
   * the plugin.
   * @returns {Promise<PopApi>} - The PopApi instance with the installed
   * plugins.
   */


  /**
   * The arguments passed down to the logger middleware.
   * @type {Object}
   */


  /**
   * A map of the installed plugins.
   * @type {Map<any>}
   */
  static async use(Plugin, ...args) {
    const { name } = Plugin.constructor;
    if (PopApi._installedPlugins.has(name)) {
      return this;
    }

    const plugin = typeof Plugin === 'function' ? await new Plugin(this, ...args) : null;

    if (plugin) {
      PopApi._installedPlugins.set(name, plugin);
    }

    return this;
  }

}
exports.default = PopApi;
PopApi.app = (0, _express2.default)();
PopApi._installedPlugins = new Map();