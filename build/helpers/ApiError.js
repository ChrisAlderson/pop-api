'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _statusCodes = require('./statusCodes');

var _statusCodes2 = _interopRequireDefault(_statusCodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ApiError extends Error {
  constructor({
    message,
    status = _statusCodes2.default.INTERNAL_SERVER_ERROR,
    isPublic = false
  }) {
    super(message);

    this.name = this.constructor.name;

    this.message = message;

    this.status = status;

    this.isPublic = isPublic;

    this.isOperational = true;

    Error.captureStackTrace(this, ApiError);
  }

}
exports.default = ApiError;