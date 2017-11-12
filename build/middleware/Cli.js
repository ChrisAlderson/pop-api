'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Class The class for the command line interface.
 * @type {Cli}
 */
class Cli {

  /**
   * Create a new Cli object.
   * @param {!PopApi} PopApi - The PopApi instance to bind the cli to.
   * @param {!Object} options - The options for the cli.
   * @param {?Array<string>} options.argv - The arguments to be parsed by
   * commander.
   * @param {!string} options.name - The name of the Cli program.
   * @param {!string} [options.version] - The version of the Cli program.
   */


  /**
   * The name of the Cli program.
   * @type {string}
   */
  constructor(PopApi, { argv, name, version }) {
    /**
     * The command line parser to process the Cli inputs.
     * @type {Command}
     */
    this.program = _commander2.default;
    /**
     * The name of the Cli program.
     * @type {string}
     */
    this._name = name;

    // Setup the Cli program.
    this.program.version(`${this._name} v${version}`).option('-m, --mode <type>', 'Run the API in a particular mode.', /^(pretty|quiet|ugly)$/i);

    // Extra output on top of the default help output
    this.program.on('--help', this.help);

    this._run(argv, PopApi);
  }

  /**
   * Method for displaying the --help option
   * @returns {undefined}
   */


  /**
   * The command line parser to process the Cli inputs.
   * @type {Command}
   */
  help() {
    console.info();
    console.info('  Examples:\n');
    console.info(`    $ ${this._name} -m <pretty|quiet|ugly>`);
    console.info(`    $ ${this._name} --mode <pretty|quiet|ugly>\n`);
  }

  /**
   * Handle the --mode Cli option.
   * @param {?string} [m] - The mode to run the API in.
   * @returns {Object} - The options to pass to the Logger middleware.
   */
  _mode(m) {
    const testing = process.env.NODE_ENV === 'test';

    switch (m) {
      case 'quiet':
        return {
          pretty: false,
          quiet: true
        };
      case 'ugly':
        return {
          pretty: false,
          quiet: testing
        };
      case 'pretty':
      default:
        return {
          pretty: !testing,
          quiet: testing
        };
    }
  }

  /**
   * Run the Cli program.
   * @param {?Array<string>} argv - The arguments to be parsed by commander.
   * @param {!PopApi} PopApi - The PopApi instance to bind the logger to.
   * @returns {undefined}
   */
  _run(argv, PopApi) {
    if (argv) {
      this.program.parse(argv);
    }

    if (this.program.mode) {
      PopApi.loggerArgs = this._mode(this.program.mode);
    } else {
      console.error('\n  error: no valid command given, please check below:');
      return this.program.help();
    }
  }

}
exports.default = Cli; // Import the necessary modules.

/* eslint-disable no-console */
/**
 * node.js command-line interfaces made easy
 * @external {Command} https://github.com/tj/commander.js
 */