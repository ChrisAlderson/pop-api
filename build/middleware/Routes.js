'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _responseTime = require('response-time');

var _responseTime2 = _interopRequireDefault(_responseTime);

var _http = require('http');

var _helpers = require('../helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Class for setting up the Routes.
 * @type {Routes}
 */
// Import the necessary modules.
class Routes {

  /**
   * Create a new Routes object.
   * @param {!PopApi} PopApi - The PopApi instance to bind the routes to.
   * @param {!Object} options - The options for the routes.
   * @param {!Express} options.app - The Express application.
   * @param {?Array<Object>} options.controllers - The controllers to register.
   */
  constructor(PopApi, { app, controllers }) {
    this._setupExpress(app, PopApi, controllers, PopApi.expressLogger);

    PopApi.app = app;
  }

  /**
   * Register the controllers found in the controllers directory.
   * @param {!Express} app - The Express instance to register the routers to.
   * @param {!PopApi} PopApi - The PopApi instance to bind the routes to.
   * @param {!Array<Object>} controllers - The controllers to register.
   * @returns {undefined}
   */
  _registerControllers(app, PopApi, controllers) {
    controllers.forEach(c => {
      const { Controller, constructor } = c;
      const controller = new Controller(constructor);

      const router = _express2.default.Router();
      controller.registerRoutes(router, PopApi);

      app.use('/', router);
    });
  }

  /**
   * Convert the thrown errors to an instance of ApiError.
   * @param {!Error} err - The caught error.
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @param {!Function} next - The ExpressJS next function.
   * @returns {undefined}
   */
  _convertErrors(err, req, res, next) {
    if (!(err instanceof _helpers.ApiError)) {
      const error = new _helpers.ApiError({
        message: err.message
      });
      return next(error);
    }

    return next(err);
  }

  /**
   * Catch the 404 errors.
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @param {!Function} next - The ExpressJS next function.
   * @returns {undefined}
   */
  _setNotFoundHandler(req, res, next) {
    const err = new _helpers.ApiError({
      message: 'Api not found',
      status: _helpers.statusCodes.NOT_FOUND
    });

    return next(err);
  }

  /**
   * Error handler middleware
   * @param {!ApiError} err - The caught error.
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @param {!Function} next - The ExpressJS next function.
   * @returns {undefined}
   */
  _setErrorHandler(err, req, res, next) {
    const { status } = err;
    const body = {
      message: err.isPublic ? err.message : `${status} ${_http.STATUS_CODES[status]}`
    };

    if (process.env.NODE_ENV === 'development') {
      body.stack = err.stack;
    }

    return res.status(status).json(body);
  }

  /**
   * Add security sentitive headers.
   * @see https://github.com/shieldfy/API-Security-Checklist#output
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @param {!Function} next - The ExpressJS next function.
   * @returns {undefined}
   */
  _addSecHeaders(req, res, next) {
    res.setHeader('X-Content-Type-Options', 'no-sniff');
    res.setHeader('X-Frame-Options', 'deny');
    res.setHeader('Content-Security-Policy', 'default-src: \'none\'');

    return next();
  }

  /**
   * Remove security sentitive headers.
   * @see https://github.com/shieldfy/API-Security-Checklist#output
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @param {!Function} next - The ExpressJS next function.
   * @returns {undefined}
   */
  _removeSecHeaders(req, res, next) {
    res.removeHeader('X-Powered-By');
    res.removeHeader('X-AspNet-Version');
    res.removeHeader('Server');

    return next();
  }

  /**
   * Setup the ExpressJS service.
   * @param {!Express} app - The ExpressJS instance.
   * @param {!PopApi} PopApi - The PopApi instance to bind the routes to.
   * @param {!Array<Object>} controllers - The controllers to register.
   * @param {!ExpressWinston} [logger] - Pretty output with Winston logging.
   * @returns {undefined}
   */
  _setupExpress(app, PopApi, controllers, logger) {
    // Enable parsing URL encoded bodies.
    app.use(_bodyParser2.default.urlencoded({
      extended: true
    }));

    // Enable parsing JSON bodies.
    app.use(_bodyParser2.default.json());

    // Enables compression of response bodies.
    app.use((0, _compression2.default)({
      threshold: 1400,
      level: 4,
      memLevel: 3
    }));

    // Enable response time tracking for HTTP request.
    app.use((0, _responseTime2.default)());

    // Enable HTTP request logging.
    if (logger) {
      app.use(logger);
    }

    // Set and remove the security sensitive headers.
    app.use(this._addSecHeaders);
    app.use(this._removeSecHeaders);

    // Register the controllers.
    if (controllers) {
      this._registerControllers(app, PopApi, controllers);
    }

    // Convert the caught errors to the ApiError instance.
    app.use(this._convertErrors);

    // Set the default not found handling middleware.
    app.use(this._setNotFoundHandler);

    // Set the default error handling middleware.
    app.use(this._setErrorHandler);
  }

}
exports.default = Routes;