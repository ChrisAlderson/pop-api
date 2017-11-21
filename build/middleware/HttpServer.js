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

class HttpServer {
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

  _forkWorkers() {
    for (let i = 0; i < Math.min(_os2.default.cpus().length, this._workers); i++) {
      _cluster2.default.fork();
    }
  }

  _workersOnExit() {
    _cluster2.default.on('exit', worker => {
      const msg = `Worker '${worker.process.pid}' died, spinning up another!`;
      logger.error(msg);

      _cluster2.default.fork();
    });
  }

  _setupApi(app) {
    if (_cluster2.default.isMaster) {
      this._forkWorkers();
      this._workersOnExit();

      logger.info(`API started on port: ${this._port}`);
    } else {
      app.listen(this._port);
    }
  }

  closeApi(connection, done = () => {}) {
    this._server.close(() => {
      connection.disconnectMongoDb().then(() => {
        logger.info('Closed out remaining connections.');
        done();
      });
    });
  }

}
exports.default = HttpServer;