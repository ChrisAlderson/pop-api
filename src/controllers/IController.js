// Import the necessary modules.
// @flow
import type { $Application } from 'express'

/**
 * Interface for the route controllers.
 * @interface
 * @type {IController}
 */
export default class IController {

  /**
   * Default method to register the routes.
   * @abstract
   * @param {!Express} app - The express instance to register the routes to.
   * @param {?PopApi} [PopApi] - The PopApi instance.
   * @throws {Error} - Using default method: 'registerRoutes'
   * @returns {undefined}
   */
  registerRoutes(app: $Application, PopApi?: any): void {
    throw new Error('Using default method: \'registerRoutes\'')
  }

}
