// Import the necessary modules.
// @flow
/* eslint-disable no-unused-expressions */
import cluster from 'cluster'
import Express, { type $Application } from 'express'
import http from 'http'
import sinon from 'sinon'
import { expect } from 'chai'

import Database from '../../src/middleware/Database'
import Server from '../../src/middleware/Server'
import { name } from '../../package'

/** @test {Server} */
describe('Server', () => {
  /**
   * The Express instance to test with.
   * @type {Express}
   */
  let app: $Application

  /**
   * The server instance to test.
   * @type {Server}
   */
  let server: Server

  /**
   * Hook for setting up the Server tests.
   * @type {Function}
   */
  before(() => {
    app = Express()
    server = new Server({}, {
      app,
      workers: 0
    })
  })

  /** @test {Server#constructor} */
  it('should check the attributes of the Server', () => {
    const stub = sinon.stub(cluster, 'fork')
    stub.returns(null)

    new Server({}, { app }) // eslint-disable-line no-new

    stub.restore()
  })

  /** @test {Server#constructor} */
  it('should check the attributes of the Server', () => {
    expect(server._port).to.exist
    expect(server._port).to.be.a('number')
    expect(server._server).to.exist
    expect(server._server).to.be.an('object')
    expect(server._workers).to.exist
    expect(server._workers).to.be.a('number')
  })

  /** @test {Server#_forkWorkers} */
  it('should fork the workers', () => {
    const stub = sinon.stub(cluster, 'fork')
    stub.returns(null)

    server._workers = 2
    server._forkWorkers()

    server._workers = 0
    stub.restore()
  })

  /** @test {Server#_workersOnExit} */
  it('should handle the exit event of the workers', done => {
    const stub = sinon.stub(cluster, 'fork')
    stub.returns(null)

    server._workersOnExit()

    cluster.emit('exit', {
      process: {
        pid: 1
      }
    })
    stub.restore()

    done()
  })

  /** @test {Server#_setupApi} */
  it('should start the API in worker mode', () => {
    const httpStub = sinon.stub(http, 'createServer')
    const listen = {
      listen() {
        return null
      }
    }
    httpStub.returns(listen)

    const stubMaster = sinon.stub(cluster, 'isMaster')
    stubMaster.value(false)

    server._setupApi(app)

    httpStub.restore()
    stubMaster.restore()
  })

  /** @test {Server.closeApi} */
  it('should close the API', done => {
    // const connection: Database = {
    const connection = new Database({}, {
      database: name
    })

    server.closeApi(connection)
    server.closeApi(connection, done)
  })
})
