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

class Routes {
  constructor(PopApi, { app, controllers }) {
    this._setupExpress(app, PopApi, controllers);

    PopApi.app = app;
  }

  _registerControllers(app, PopApi, controllers) {
    controllers.forEach(c => {
      const { Controller, args } = c;
      const controller = new Controller(args);

      const router = _express2.default.Router();
      controller.registerRoutes(router, PopApi);

      app.use('/', router);
    });
  }

  _convertErrors(err, req, res, next) {
    if (!(err instanceof _helpers.ApiError)) {
      const error = new _helpers.ApiError({
        message: err.message
      });
      return next(error);
    }

    return next(err);
  }

  _setNotFoundHandler(req, res, next) {
    const err = new _helpers.ApiError({
      message: 'Api not found',
      status: _helpers.statusCodes.NOT_FOUND
    });

    return next(err);
  }

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

  _addSecHeaders(req, res, next) {
    res.setHeader('X-Content-Type-Options', 'no-sniff');
    res.setHeader('X-Frame-Options', 'deny');
    res.setHeader('Content-Security-Policy', 'default-src: \'none\'');

    return next();
  }

  _removeSecHeaders(req, res, next) {
    res.removeHeader('X-Powered-By');
    res.removeHeader('X-AspNet-Version');
    res.removeHeader('Server');

    return next();
  }

  _setupExpress(app, PopApi, controllers) {
    app.use(_bodyParser2.default.urlencoded({
      extended: true
    }));

    app.use(_bodyParser2.default.json());

    app.use((0, _compression2.default)({
      threshold: 1400,
      level: 4,
      memLevel: 3
    }));

    app.use((0, _responseTime2.default)());

    if (PopApi && PopApi.expressLogger) {
      app.use(PopApi.expressLogger);
    }

    app.use(this._addSecHeaders);
    app.use(this._removeSecHeaders);

    if (controllers) {
      this._registerControllers(app, PopApi, controllers);
    }

    app.use(this._convertErrors);

    app.use(this._setNotFoundHandler);

    app.use(this._setErrorHandler);
  }

}
exports.default = Routes;