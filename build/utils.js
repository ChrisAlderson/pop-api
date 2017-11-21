'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTemp = createTemp;
exports.executeCommand = executeCommand;

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _fs = require('fs');

var _child_process = require('child_process');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function createTemp(path) {
  if ((0, _fs.existsSync)(path)) {
    await (0, _del2.default)([`${path}/**`]).then(([res]) => res);
  }

  return new Promise(resolve => {
    _mkdirp2.default.sync(path);
    return resolve(path);
  });
}

function executeCommand(cmd, args) {
  return new Promise((resolve, reject) => {
    const res = (0, _child_process.spawn)(cmd, args);

    res.stdout.on('data', data => resolve(data.toString()));
    res.on('error', reject);
    res.on('close', code => {
      if (code === 0) {
        return resolve();
      }

      const err = new Error(`${cmd} exited with code: ${code}`);
      return reject(err);
    });
  });
}