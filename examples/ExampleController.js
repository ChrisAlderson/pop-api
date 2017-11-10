// Import the necessary modules.
// @flow
import type {
  $Application,
  $Response,
  $Request
} from 'express'

import BaseContentController from '../src/controllers/BaseContentController'

/**
 * An example controller to register.
 * @implements {BaseContentController}
 * @type {ExampleController}
 */
export default class ExampleController extends BaseContentController {

  /**
   * Implementing the registerRoutes method from the IController.
   * @override
   * @param {!Express} app - The express instance to register the routes to.
   * @returns {undefined}
   */
  registerRoutes(app: $Application): void {
    // Include the routes from the BaseContentController.
    super.registerRoutes(app)

    app.get('/hello/:name', this.getHello)
  }

  /**
   * Say hello to a user.
   * @param {Object} req - The express request object.
   * @param {!Object} res - The express response object.
   * @returns {Object} - Object with a message saying the name parameter.
   */
  getHello(req: $Request, res: $Response): $Response {
    const { name } = req.params
    return res.json({
      msg: `Hello, ${name}`
    })
  }

}