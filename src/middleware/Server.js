// Import the necessary modules.
// @flow
import cluster from 'cluster'
/** @external {http~Server} https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_class_http_server */
import http from 'http'
import os from 'os'

import type Database from './Database'

/**
 * Class for starting the API.
 * @type {Server}
 */
export default class HttpServer {

  /**
   * The port on which the API will run on. Default is `5000`.
   * @type {number}
   */
  _port: number

  /**
   * The http server object.
   * @type {http~Server}
   * @see https://nodejs.org/api/http.html#http_http_createserver_requestlistener
   */
  _server: Server

  /**
   * The amount of workers on the cluster.
   * @type {number}
   */
  _workers: number

  /**
   * Create a new Server object.
   * @param {!PopApi} PopApi - The PopApi instance to bind the server to.
   * @param {!Ojbect} options - The options for the server.
   * @param {!Express} options.app - The Express application.
   */
  constructor(PopApi: any, {
    app,
    port = process.env.PORT,
    workers = 2
  }: Object): void {
    this._port = port || 5000
    this._server = http.createServer(app)
    this._workers = workers

    this._setupApi(app)

    PopApi.server = this
  }

  /**
   * For the workers.
   * @returns {undefined}
   */
  _forkWorkers(): void {
    for (let i = 0; i < Math.min(os.cpus().length, this._workers); i++) {
      cluster.fork()
    }
  }

  /**
   * Handle the errors for workers.
   * @returns {undefined}
   */
  _workersOnExit(): void {
    cluster.on('exit', worker => {
      const msg = `Worker '${worker.process.pid}' died, spinning up another!`
      logger.error(msg)

      cluster.fork()
    })
  }

  /**
   * Method to setup the cron job.
   * @param {!Express} app - The Express application.
   * @returns {undefined}
   */
  _setupApi(app): void {
    if (cluster.isMaster) {
      this._forkWorkers()
      this._workersOnExit()

      logger.info(`API started on port: ${this._port}`)
    } else {
      app.listen(this._port)
    }
  }

  /**
   * Method to stop the API from running.
   * @param {Database} connection - The database connection to close.
   * @param {Function} done - function to exit the API.
   * @returns {undefined}
   */
  closeApi(connection: Database, done: Function = () => {}): void {
    this._server.close(() => {
      connection.disconnectMongoDb().then(() => {
        logger.info('Closed out remaining connections.')

        done()
      })
    })
  }

}
