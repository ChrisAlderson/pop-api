'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _fs = require('fs');

var _path = require('path');

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Class for setting up MongoDB.
 * @type {Database}
 */
// Import the necessary modules.
class Database {

  /**
   * Create a new Database object.
   * @param {!PopApi} PopApi - The PopApi instance to bind the database to.
   * @param {!Object} options - The options for the database.
   * @param {!string} options.database - The arguments to be parsed by
   * @param {!Array<string>} [options.hosts=['localhost']] - The hosts for the
   * MongoDb connection.
   * @param {!number} [options.port=27017] - The port for the MongoDb
   * connection.
   * @param {?string} [options.username=''] - The username for the MongoDB
   * connection.
   * @param {?string} [options.password=''] - The password for the MongoDb
   * connection.
   */


  /**
   * The username of the database. DBy default this is left empty.
   * @type {string}
   */


  /**
   * The host of the server of the database. Default is `['localhost']`.
   * @type {Array<string>}
   */
  constructor(PopApi, {
    database,
    hosts = ['localhost'],
    port = 27017,
    username = '',
    password = ''
  }) {
    process.env.NODE_ENV = process.env.NODE_ENV || '';

    const {
      MONGO_PORT_27017_TCP_ADDR,
      MONGO_PORT_27017_TCP_PORT,
      NODE_ENV
    } = process.env;

    this._database = `${database}-${NODE_ENV}`;
    this._hosts = MONGO_PORT_27017_TCP_ADDR ? [MONGO_PORT_27017_TCP_ADDR] : hosts;
    this._port = Number(MONGO_PORT_27017_TCP_PORT) || port;
    this._username = username;
    this._password = password;

    PopApi.connection = this;
  }

  /**
   * Connection and configuration of the MongoDB database.
   * @returns {Promise<undefined, Error>} - The promise to connect to MongoDB.
   */


  /**
   * The password of the database. By default this is left empty.
   * @type {string}
   */


  /**
   * The port of the database. Default is `27017`.
   * @type {string}
   */


  /**
   * The name of the database. Default is the package name with the
   * environment mode.
   * @type {string}
   */
  connectMongoDb() {
    let uri = 'mongodb://';
    if (this._username && this._password) {
      uri += `${this._username}:${this._password}@`;
    }
    uri += `${this._hosts.join(',')}:${this._port}/${this._database}`;

    _mongoose2.default.Promise = global.Promise;
    return _mongoose2.default.connect(uri, {
      useMongoClient: true
    }).catch(err => Promise.reject(new Error(err)));
  }

  /**
   * Disconnect from the MongoDB database.
   * @returns {Promise<undefined, Error>} - The promise to disconnect from
   * MongoDB.
   */
  disconnectMongoDb() {
    return _mongoose2.default.connection.close();
  }

  /**
   * Export a JSON file collection.
   * @param {!string} collection - The collection to export.
   * @param {!string} outputFile - The path of the output file of the export.
   * @returns {Promise<string, undefined>} - The promise to export a
   * collection.
   */
  exportCollection(collection, outputFile) {

    const args = ['-d', this._database, '-c', `${collection}s`, '-o', outputFile];
    return (0, _utils.executeCommand)('mongoexport', args);
  }

  /**
   * Import a JSON file collection.
   * @param {!string} collection - The collection to import.
   * @param {!string} jsonFile - The JSON file to import.
   * @returns {Promise<string, undefined>} - The promise to import a
   * collection.
   */
  importCollection(collection, jsonFile) {
    const file = (0, _path.isAbsolute)(jsonFile) ? jsonFile : (0, _path.join)(...[__dirname, '..', '..', jsonFile]);

    if (!(0, _fs.existsSync)(file)) {
      const err = new Error(`no such file found for '${file}'`);
      return Promise.reject(err);
    }

    const args = ['-d', this._database, '-c', `${collection}s`, '--file', jsonFile, '--upsert'];
    return (0, _utils.executeCommand)('mongoimport', args);
  }

}
exports.default = Database;