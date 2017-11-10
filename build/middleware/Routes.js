'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _responseTime = require('response-time');

var _responseTime2 = _interopRequireDefault(_responseTime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Class for setting up the Routes.
 * @type {Routes}
 */
class Routes {

  /**
   * Create a new Routes object.
   * @param {!PopApi} PopApi - The PopApi instance to bind the routes to.
   * @param {!Ojbect} options - The options for the routes.
   * @param {!Express} options.app - The Express application.
   * @param {?Array<Object>} options.controllers - The controllers to register.
   */
  constructor(PopApi, { app, controllers }) {
    this._setupExpress(app, PopApi.expressLogger);

    if (controllers) {
      this._registerControllers(app, controllers);
    }

    PopApi.app = app;
  }

  /**
   * Register the controllers found in the controllers directory.
   * @param {!Express} app - The Express instance to register the controllers
   * to.
   * @param {!Array<Object>} controllers - The controllers to register.
   * @returns {undefined}
   */
  _registerControllers(app, controllers) {
    controllers.forEach(c => {
      const { Controller, constructor } = c;
      const controller = new Controller(constructor);

      controller.registerRoutes(app);
    });
  }

  /**
   * Setup the ExpressJS service.
   * @param {!Express} app - The ExpressJS instance.
   * @param {!ExpressWinston} [logger] - Pretty output with Winston loggin.
   * @returns {undefined}
   */
  _setupExpress(app, logger) {
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
  }

}
exports.default = Routes; // Import the necessary modules.