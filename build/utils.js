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

/**
 * Create a temporary directory for files for the API.
 * @param {!string} path - The path to the directory to create.
 * @returns {Promise<string, Error>} - The path to the created directory.
 */
// Import the necessary modules.
function createTemp(path) {
  if ((0, _fs.existsSync)(path)) {
    return (0, _del2.default)(`${path}/**`).then(([res]) => res);
  }

  return new Promise(resolve => {
    _mkdirp2.default.sync(path);
    return resolve(path);
  });
}

/**
 * Execute a command from within the root folder.
 * @param {!string} cmd - The command to execute.
 * @param {?Array<string>} args - The arguments passed to the command.
 * @returns {Promise<string, Error>} - The output of the command.
 */
function executeCommand(cmd, args) {
  return new Promise((resolve, reject) => {
    const res = (0, _child_process.spawn)(cmd, args);

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