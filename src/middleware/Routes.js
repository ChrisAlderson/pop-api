// Import the necessary modules.
// @flow
import bodyParser from 'body-parser'
import compress from 'compression'
import responseTime from 'response-time'
import type { $Application } from 'express'
import type { logger as ExpressWinston } from 'express-winston'

/**
 * Class for setting up the Routes.
 * @type {Routes}
 */
export default class Routes {

  /**
   * Create a new Routes object.
   * @param {!PopApi} PopApi - The PopApi instance to bind the routes to.
   * @param {!Object} options - The options for the routes.
   * @param {!Express} options.app - The Express application.
   * @param {?Array<Object>} options.controllers - The controllers to register.
   */
  constructor(PopApi: any, {app, controllers}: Object): void {
    this._setupExpress(app, PopApi.expressLogger)

    if (controllers) {
      this._registerControllers(app, controllers)
    }

    PopApi.app = app
  }

  /**
   * Register the controllers found in the controllers directory.
   * @param {!Express} app - The Express instance to register the controllers
   * to.
   * @param {!Array<Object>} controllers - The controllers to register.
   * @returns {undefined}
   */
  _registerControllers(app: $Application, controllers: Array<Object>): void {
    controllers.forEach(c => {
      const { Controller, constructor } = c
      const controller = new Controller(constructor)

      controller.registerRoutes(app)
    })
  }

  /**
   * Setup the ExpressJS service.
   * @param {!Express} app - The ExpressJS instance.
   * @param {!ExpressWinston} [logger] - Pretty output with Winston loggin.
   * @returns {undefined}
   */
  _setupExpress(app: $Application, logger?: ExpressWinston): void {
    // Enable parsing URL encoded bodies.
    app.use(bodyParser.urlencoded({
      extended: true
    }))

    // Enable parsing JSON bodies.
    app.use(bodyParser.json())

    // Enables compression of response bodies.
    app.use(compress({
      threshold: 1400,
      level: 4,
      memLevel: 3
    }))

    // Enable response time tracking for HTTP request.
    app.use(responseTime())

    // Enable HTTP request logging.
    if (logger) {
      app.use(logger)
    }
  }

}
