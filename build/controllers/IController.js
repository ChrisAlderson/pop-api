'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});


/**
 * Interface for the route controllers.
 * @interface
 * @type {IController}
 */
class IController {

  /**
   * Default method to register the routes.
   * @abstract
   * @param {!Object} router - The express router to register the routes to.
   * @param {?PopApi} [PopApi] - The PopApi instance.
   * @throws {Error} - Using default method: 'registerRoutes'
   * @returns {undefined}
   */
  registerRoutes(router, PopApi) {
    throw new Error('Using default method: \'registerRoutes\'');
  }

}
exports.default = IController;