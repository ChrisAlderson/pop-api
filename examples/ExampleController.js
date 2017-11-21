// Import the necessary modules.
// @flow
import type {
  $Response,
  $Request,
  NextFunction
} from 'express'

import BaseContentController from '../src/controllers/BaseContentController'

/**
 * An example controller to register.
 * @implements {BaseContentController}
 * @type {ExampleController}
 */
export default class ExampleController extends BaseContentController {

  /**
   * Default method to register the routes.
   * @override
   * @param {!Object} router - The express router to register the routes to.
   * @param {?PopApi} [PopApi] - The PopApi instance.
   * @returns {undefined}
   */
  registerRoutes(router: any, PopApi?: any): void {
    // Include the routes from the BaseContentController.
    super.registerRoutes(router, PopApi)

    router.route('/hello/:name').get(this.getHello)
  }

  /**
   * Say hello to a user.
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @param {!Function} next - The ExpressJS next function.
   * @returns {Object} - Object with a message saying the name parameter.
   */
  getHello(req: $Request, res: $Response, next: NextFunction): $Response {
    const { name } = req.params
    return res.json({
      msg: `Hello, ${name}`
    })
  }

}
