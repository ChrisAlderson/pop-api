// Import the necessary modules.
// @flow
import type {
  $Application,
  $Response,
  $Request
} from 'express'

import BaseContentController from '../src/controllers/BaseContentController'

/**
 * An example controller with authentication middleware to register.
 * @implements {BaseContentController}
 * @type {ExampleAuthController}
 */
export default class ExampleAuthController extends BaseContentController {

  /**
   * Implementing the registerRoutes method from the IController.
   * @override
   * @param {!Express} app - The express instance to register the routes to.
   * @param {?PopApi} [PopApi] - The PopApi instance.
   * @returns {undefined}
   */
  registerRoutes(app: $Application, PopApi?: any): void {
    // Include the routes from the BaseContentController.
    super.registerRoutes(app)

    // Assuming PopApi has authentication middleware registered.
    if (PopApi && PopApi.authMiddleware) {
      app.get('/hello/:name', PopApi.authMiddleware, this.getHello)
    } else {
      app.get('/hello/:name', this.getHello)
    }
  }

  /**
   * Say hello to a user.
   * @param {Object} req - The express request object.
   * @param {!Object} res - The express response object.
   * @returns {Object} - Object with a message saying the name parameter.
   */
  getHello(req: $Request, res: $Response): $Response {
    const { name } = req.param
    return res.json({
      msg: `Hello, ${name}`
    })
  }

}
