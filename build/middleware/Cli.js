'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Cli {
  constructor(PopApi, { argv, name, version }) {
    this.program = _commander2.default;

    this._name = name;

    this.initOptions(version);
    this.program.on('--help', this.printHelp.bind(this));

    if (argv) {
      this._run(PopApi, argv);
    }
  }

  initOptions(version) {
    return this.program.version(`${this._name} v${version}`).option('-m, --mode <type>', 'Run the API in a particular mode.', /^(pretty|quiet|ugly)$/i);
  }

  getHelp() {
    return ['', '  Examples:', '', `    $ ${this._name} -m <pretty|quiet|ugly>`, `    $ ${this._name} --mode <pretty|quiet|ugly>`];
  }

  printHelp() {
    console.info(`${this.getHelp().join('\n')}\n`);
  }

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

  _run(PopApi, argv) {
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
exports.default = Cli;