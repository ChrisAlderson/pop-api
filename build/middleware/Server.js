'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cluster = require('cluster');

var _cluster2 = _interopRequireDefault(_cluster);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Class for starting the API.
 * @type {Server}
 */

/** @external {http~Server} https://nodejs.org/dist/latest-v8.x/docs/api/http.html#http_class_http_server */
class HttpServer {

  /**
   * Create a new Server object.
   * @param {!PopApi} PopApi - The PopApi instance to bind the server to.
   * @param {!Ojbect} options - The options for the server.
   * @param {!Express} options.app - The Express application.
   */


  /**
   * The http server object.
   * @type {http~Server}
   * @see https://nodejs.org/api/http.html#http_http_createserver_requestlistener
   */
  constructor(PopApi, {
    app,
    port = process.env.PORT,
    workers = 2
  }) {
    this._port = port || 5000;
    this._server = _http2.default.createServer(app);
    this._workers = workers;

    this._setupApi(app);

    PopApi.server = this;
  }

  /**
   * For the workers.
   * @returns {undefined}
   */


  /**
   * The amount of workers on the cluster.
   * @type {number}
   */


  /**
   * The port on which the API will run on. Default is `5000`.
   * @type {number}
   */
  _forkWorkers() {
    for (let i = 0; i < Math.min(_os2.default.cpus().length, this._workers); i++) {
      _cluster2.default.fork();
    }
  }

  /**
   * Handle the errors for workers.
   * @returns {undefined}
   */
  _workersOnExit() {
    _cluster2.default.on('exit', worker => {
      const msg = `Worker '${worker.process.pid}' died, spinning up another!`;
      logger.error(msg);

      _cluster2.default.fork();
    });
  }

  /**
   * Method to setup the cron job.
   * @param {!Express} app - The Express application.
   * @returns {undefined}
   */
  _setupApi(app) {
    if (_cluster2.default.isMaster) {
      this._forkWorkers();
      this._workersOnExit();

      logger.info(`API started on port: ${this._port}`);
    } else {
      app.listen(this._port);
    }
  }

  /**
   * Method to stop the API from running.
   * @param {Database} connection - The database connection to close.
   * @param {Function} done - function to exit the API.
   * @returns {undefined}
   */
  closeApi(connection, done = () => {}) {
    this._server.close(() => {
      connection.disconnectMongoDb().then(() => {
        logger.info('Closed out remaining connections.');

        done();
      });
    });
  }

}
exports.default = HttpServer; // Import the necessary modules.