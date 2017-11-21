// Import the necessary modules.
// @flow
import { join } from 'path'
/**
 * express.js middleware for winstonjs
 * @external {ExpressWinston} https://github.com/bithavoc/express-winston
 */
import { logger as ExpressWinston } from 'express-winston'
/**
 * a multi-transport async logging library for node.js
 * @external {Winston} https://github.com/winstonjs/winston
 */
import {
  createLogger as Winston,
  format,
  transports
} from 'winston'
import { sprintf } from 'sprintf-js'

/**
 * Class for setting up the logger.
 * @type {Logger}
 */
export default class Logger {

  /**
   * The log levels Winston will be using.
   * @type {Object}
   */
  _levels: Object

  /**
   * The name of the log file.
   * @type {string}
   */
  _name: string

  /**
   * The directory where the log file will be stored.
   * @type {string}
   */
  _logDir: string

  /**
   * Create a new Logger object.
   * @param {!PopApi} PopApi - The PopApi instance to bind the logger to.
   * @param {!Object} options - The options for the logger.
   * @param {!string} options.name - The name of the log file.
   * @param {?boolean} [options.pretty] - Pretty output with Winston logging.
   * @param {?boolean} [options.quiet] - No output.
   */
  constructor(PopApi: any, {name, logDir, pretty, quiet}: Object): void {
    /**
     * The log levels Winston will be using.
     * @type {Object}
     */
    this._levels = {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3
    }
    /**
     * The name of the log file.
     * @type {string}
     */
    this._name = name
    /**
     * The directory where the log file will be stored.
     * @type {string}
     */
    this._logDir = logDir

    global.logger = this._getLogger('winston', pretty, quiet)
    PopApi.expressLogger = this._getLogger('express', pretty, quiet)
  }

  /**
   * Check if the message is empty and replace it with the meta.
   * @param {!Object} args - Arguments passed by Winston.
   * @returns {Object} - Formatter arguments passed by Winston.
   */
  _checkEmptyMessage(args: Object): Object {
    if (args.message === '' && Object.keys(args.meta).length !== 0) {
      args.message = JSON.stringify(args.meta)
    }

    return args
  }

  /**
   * Get the color of the output based on the log level.
   * @param {?string} [level] - The log level.
   * @returns {string} - A color based on the log level.
   */
  _getLevelColor(level?: string): string {
    let color = '\x1b[36m'
    switch (level) {
      case 'error':
        color = '\x1b[31m'
        break
      case 'warn':
        color = '\x1b[33m'
        break
      case 'info':
        color = '\x1b[36m'
        break
      case 'debug':
        color = '\x1b[34m'
        break
      default:
        color = '\x1b[36m'
        break
    }

    return color
  }

  /**
   * Formatter method which formats the output to the console.
   * @param {!Object} args - Arguments passed by Winston.
   * @returns {string} - The formatted message.
   */
  _consoleFormatter(args: Object): string {
    const newArgs = this._checkEmptyMessage(args)
    const color = this._getLevelColor(newArgs.level)

    return sprintf(
      `\x1b[0m[%s] ${color}%5s:\x1b[0m %2s/%d: \x1b[36m%s\x1b[0m`,
      new Date().toISOString(),
      newArgs.level.toUpperCase(),
      this._name,
      process.pid,
      newArgs.message
    )
  }

  /**
   * Formatter method which formats the output to the log file.
   * @param {!Object} args - Arguments passed by Winston.
   * @returns {string} - The formatted message.
   */
  _fileFormatter(args: Object): string {
    const newArgs = this._checkEmptyMessage(args)
    return JSON.stringify({
      name: this._name,
      pid: process.pid,
      level: newArgs.level,
      msg: newArgs.message,
      time: new Date().toISOString()
    })
  }

  /**
   * Create a Winston instance.
   * @param {?boolean} [pretty] - Pretty mode for output with colors.
   * @returns {Winston} - A configured Winston object.
   */
  _createWinston(pretty?: boolean): Winston {
    const { Console, File } = transports

    const f = pretty
      ? format.printf(this._consoleFormatter.bind(this))
      : format.simple()

    return Winston({
      levels: this._levels,
      transports: [
        new Console({
          name: this._name,
          format: f
        }),
        new File({
          filename: join(...[
            this._logDir,
            `${this._name}.log`
          ]),
          format: format.printf(this._fileFormatter.bind(this)),
          maxsize: 5242880,
          handleExceptions: true
        })
      ],
      exitOnError: false
    })
  }

  /**
   * Create an Express Winston instance.
   * @param {?boolean} [pretty] - Pretty mode for output with colors.
   * @returns {ExpressWinston} - A configured Express Winston object.
   */
  _createExpressWinston(pretty?: boolean): ExpressWinston {
    return new ExpressWinston({
      winstonInstance: this._createWinston(pretty),
      statusLevels: true
    })
  }

  /**
   * Method to create a global logger object based on the properties of the
   * Logger class.
   * @param {?boolean} [pretty] - Pretty mode for output with colors.
   * @param {?boolean} [quiet] - No output.
   * @returns {Object} - A configured logger.
   */
  _createLogger(pretty?: boolean, quiet?: boolean): Object {
    const logger = {}

    const winston = this._createWinston(pretty)
    Object.keys(this._levels).map(level => {
      logger[level] = quiet
        ? () => {}
        : winston[level].bind(winston)
    })

    return logger
  }

  /**
   * Get a logger object based on the choice.
   * @param {?string} [type] - The choice for the logger object.
   * @param {?boolean} [pretty] - Pretty output with Winston logging.
   * @param {?boolean} [quiet] - No output.
   * @returns {ExpressWinston|undefined} - The logger object.
   */
  _getLogger(
    type?: string,
    pretty?: boolean,
    quiet?: boolean
  ): ExpressWinston | void {
    if (!type) {
      return undefined
    }

    const t = type.toUpperCase()

    switch (t) {
      case 'EXPRESS':
        return this._createExpressWinston(pretty)
      case 'WINSTON':
        return this._createLogger(pretty, quiet)
      default:
        return undefined
    }
  }

}
