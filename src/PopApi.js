// Import the necessary modules.
// @flow
/**
 * Fast, unopinionated, minimalist web framework for node.
 * @external {Express} https://github.com/expressjs/express
 */
import Express, { type $Application } from 'express'
import { join } from 'path'

import {
  Cli,
  Database,
  Logger,
  Routes,
  Server
} from './middleware'
import * as utils from './utils'

/**
 * The PopApi class with the middleware pattern.
 * @type {PopApi}
 */
export default class PopApi {

  /**
   * The Express instance for the PopApi framework.
   * @type {Express}
   */
  static app: $Application = Express()

  /**
   * A map of the installed plugins.
   * @type {Map<any>}
   */
  static _installedPlugins: Map<string, any> = new Map()

  /**
   * The database connection.
   * @type {Database}
   */
  static connection: Database

  /**
   * The arguments passed down to the logger middleware.
   * @type {Object}
   */
  static loggerArgs: Object

  /**
   * The setup for the base framework.
   * @param {!Object} options - The options for the framework.
   * @param {!Array<Object>} options.controllers - The controllers to register.
   * @param {!string} options.name - The name for your API.
   * @param {!string} options.version - The version of your API.
   * @param {?boolean} [options.pretty] - Pretty logging output.
   * @param {?boolean} [options.quiet] - No logging output.
   * @param {?Array<string>} [options.hosts] - The hosts of the database
   * cluster.
   * @param {?number} [options.dbPort] - The port the database is on.
   * @param {?string} [options.username] - The username for the database
   * connection.
   * @param {?string} [options.password] - The password for the database
   * connection.
   * @param {?number} [options.serverPort] - The port the API will run on.
   * @param {?number} [options.workers] - The number of workers for the API.
   * @returns {undefined}
   */
  static async init({
    controllers,
    name,
    version,
    pretty,
    quiet,
    hosts = ['localhost'],
    dbPort = 27017,
    username,
    password,
    serverPort = process.env.PORT,
    workers = 2
  }: Object): Object {
    const { app } = PopApi
    const logDir = join(...[
      __dirname,
      '..',
      'tmp'
    ])
    await utils.createTemp(logDir)

    PopApi.use(Cli, {
      argv: process.argv,
      name,
      version
    })
    PopApi.use(Logger, {
      name,
      logDir,
      type: 'winston',
      pretty,
      quiet,
      ...PopApi.loggerArgs
    })
    PopApi.use(Logger, {
      name,
      logDir,
      type: 'express',
      pretty,
      quiet,
      ...PopApi.loggerArgs
    })
    PopApi.use(Database, {
      database: name,
      hosts,
      username,
      password,
      port: dbPort
    })
    PopApi.use(Server, {
      app,
      workers,
      port: serverPort
    })
    PopApi.use(Routes, {
      app,
      controllers
    })

    await PopApi.connection.connectMongoDb()

    return PopApi
  }

  /**
   * Register middleware for the PopApi framework.
   * @param {!Function} Plugin - The plugin to use.
   * @param {!Object} args - The arguments passed down to the constructor of
   * the plugin.
   * @returns {Promise<PopApi>} - The PopApi instance with the installed
   * plugins.
   */
  static async use(Plugin: any, ...args: any): any {
    const { name } = Plugin.constructor
    if (PopApi._installedPlugins.has(name)) {
      return this
    }

    const plugin = typeof Plugin === 'function'
      ? await new Plugin(this, ...args)
      : null

    if (plugin) {
      PopApi._installedPlugins.set(name, plugin)
    }

    return this
  }

}