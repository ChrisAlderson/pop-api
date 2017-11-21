'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _statusCodes = require('./statusCodes');

var _statusCodes2 = _interopRequireDefault(_statusCodes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Error class for the Api.
 * @extends {Error}
 * @type {ApiError}
 */
class ApiError extends Error {

  /**
   * Create a new ApiError object.
   * @param {!Object} options - The options for the ApiError.
   * @param {!string} options.message - The message of the error.
   * @param {!string} options.status=500 - The status code of the error.
   * @param {!boolean} options.isPublic=false - Whenever the error is public or
   * not.
   */


  /**
   * Whenever the error is public or not.
   * @type {boolean}
   */


  /**
   * The message of the error
   * @type {string}
   */
  constructor({
    message,
    status = _statusCodes2.default.INTERNAL_SERVER_ERROR,
    isPublic = false
  }) {
    super(message);

    /**
     * The name of the error
     * @type {string}
     */
    this.name = this.constructor.name;
    /**
     * The message of the error
     * @type {string}
     */
    this.message = message;
    /**
     * The status of the error
     * @type {string}
     */
    this.status = status;
    /**
     * Whenever the error is public or not.
     * @type {boolean}
     */
    this.isPublic = isPublic;
    /**
     * Whenever the errror is operational or not
     * @type {boolean}
     */
    this.isOperational = true;

    Error.captureStackTrace(this, ApiError);
  }

  /**
   * Whenever the errror is operational or not
   * @type {boolean}
   */


  /**
   * The status of the error
   * @type {string}
   */


  /**
   * The name of the error
   * @type {string}
   */
}
exports.default = ApiError; // Import the necessary modules.