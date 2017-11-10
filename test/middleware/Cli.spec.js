// Import the necessary modules.
//  @flow
/* eslint-disable no-unused-expressions */
import sinon from 'sinon'
import { expect } from 'chai'

import Cli from '../../src/middleware/Cli'
import {
  name,
  version
} from '../../package'

/** @test {Cli} */
describe('Cli', () => {
  /**
   * The Cli object to test
   * @type {Cli}
   */
  let cli: Cli

  /**
   * Stub for `console.error'
   * @type {Object}
   */
  let error: Object

  /**
   * Stub for `console.info'
   * @type {Object}
   */
  let info: Object

  /**
   * Stub for `process.exit'
   * @type {Object}
   */
  let exit: Object

  /**
   * Hook for setting up the Cli tests.
   * @type {Function}
   */
  before(() => {
    exit = sinon.stub(process, 'exit')
    error = sinon.stub(console, 'error')
    info = sinon.stub(console, 'info')

    cli = new Cli({}, {
      argv: ['', '', '-m', 'pretty'],
      name,
      version
    })
  })

  /** @test {Cli#constructor} */
  it('should check the attributes of the Cli', () => {
    expect(cli.program).to.exist
    expect(cli.program).to.be.an('object')
    expect(cli._name).to.exist
    expect(cli._name).to.be.a('string')
  })

  /** @test {Cli#help} */
  it('should print the --help option', () => {
    const val = cli.help()
    expect(val).to.be.undefined
  })

  /**
   * Helper function to test the `_mode` method.
   * @param {!string} mode - The mode parameter to test.
   * @returns {void}
   */
  function testMode(mode: string): void {
    /** @test {Cli#_mode} */
    it(`should run the --mode option with the '${mode}' option`, () => {
      const val = cli._mode(mode)
      expect(val).to.be.an('object')
    })
  }

  // Execute the test.
  ['quiet', 'ugly', 'pretty'].map(testMode)

  /** @test {Cli#_run} */
  it('should invoke no options and print the --help option', () => {
    const stub = sinon.stub(cli.program, 'outputHelp')

    const val = cli._run(['', '', '--help'], {})
    expect(val).to.be.undefined

    stub.restore()
  })

  /** @test {Cli#_run} */
  it('should not parse the arguments since there are none', () => {
    cli.program.mode = null
    const stub = sinon.stub(cli.program, 'outputHelp')

    const val = cli._run()
    expect(val).to.be.undefined

    stub.restore()
  })

  after(() => {
    error.restore()
    info.restore()
    exit.restore()
  })
})