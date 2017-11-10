// Import the necessary modules.
// @flow
/* eslint-disable no-unused-expressions */
import cluster from 'cluster'
import sinon from 'sinon'
import { expect } from 'chai'

import PopApi from '../src/PopApi'
import Routes from '../src/middleware/Routes'
import {
  name,
  version
} from '../package'

/** @test {PopApi} */
describe('PopApi', () => {
  /** @test {PopApi.app} */
  it('should have a static express instance', () => {
    expect(PopApi.app).to.exist
  })

  /** @test {PopApi._installedPlugins} */
  it('should have a static map for the installed plugins', () => {
    expect(PopApi._installedPlugins).to.exist
    expect(PopApi._installedPlugins).to.be.a('Map')
  })

  /** @test {PopApi.init} */
  it('should initiate the PopApi instance', done => {
    process.argv = ['', '', '-m', 'pretty']
    PopApi.init({
      name,
      version,
      workers: 0
    }).then(res => done())
      .catch(done)
  })

  /** @test {PopApi.init} */
  it('should initiate the PopApi instance and not create the temporary directory', done => {
    const masterStub = sinon.stub(cluster, 'isMaster')
    const forkStub = sinon.stub(cluster, 'fork')
    masterStub.value(false)

    process.argv = ['', '', '-m', 'pretty']
    PopApi.init({
      name,
      version
    }).then(res => {
      masterStub.restore()
      forkStub.restore()

      done()
    }).catch(done)
  })

  /**
   * Helper function to test the `use` method.
   * @param {!string} msg - The message to print for the test.
   * @returns {undefined}
   */
  function testUse(msg: string): void {
    /** @test {PopApi.use} */
    it(msg, done => {
      PopApi.use(Routes, {
        app: PopApi.app
      }).then(() => {
        expect(PopApi._installedPlugins).to.be.a('Map')
        expect(PopApi._installedPlugins.size).to.equal(1)

        done()
      }).catch(done)
    })
  }

  // Execute the tests.
  [
    'should register a middleware plugin',
    'should not register the same plugin twice'
  ].map(testUse)

  /** @test {PopApi.use} */
  it('should not register the plugin if it is not a class', done => {
    PopApi.use({}).then(() => {
      expect(PopApi._installedPlugins).to.be.a('Map')
      expect(PopApi._installedPlugins.size).to.equal(1)

      done()
    }).catch(done)
  })

  /**
   * Hook for tearing down the PopApi tests.
   * @type {Function}
   */
  after(done => {
    process.env.NODE_ENV = 'test'

    // PopApi.connection.disconnectMongoDb()
    //   .then(() => done())
    //   .catch(done)
    done()
  })
})