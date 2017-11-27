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

class Database {
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

    PopApi.database = this;
  }

  connect() {
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

  disconnect() {
    return _mongoose2.default.connection.close();
  }

  exportCollection(collection, outputFile) {
    const args = ['-d', this._database, '-c', `${collection}s`, '-o', outputFile];
    return (0, _utils.executeCommand)('mongoexport', args);
  }

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