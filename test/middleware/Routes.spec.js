// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
// @flow
import express, { type $Application } from 'express'
import sinon from 'sinon'
import { join } from 'path'

import {
  ContentService,
  Logger,
  Routes
} from '../../src'
import {
  ExampleController,
  ExampleModel
} from '../../examples'
import { name } from '../../package'

/** @test {Routes} */
describe('Routes', () => {
  /**
   * The express instance to test with.
   * @type {Express}
   */
  let app: $Application

  /**
   * The controllers to register.
   * @type {Array<Object>}
   */
  let controllers: Array<Object>

  /**
   * The routes instance to test.
   * @type {Server}
   */
  let routes: Routes

  /**
   * Hook for setting up the Routes tests.
   * @type {Function}
   */
  before(() => {
    chai.use(chaiHttp)

    app = express()
    controllers = [{
      Controller: ExampleController,
      args: {
        service: new ContentService({
          Model: ExampleModel,
          itemType: 'example',
          projection: {
            name: 1
          },
          query: {}
        })
      }
    }]

    routes = new Routes({
      expressLogger(req, res, next) {
        return next()
      }
    }, {
      app,
      controllers
    })
  })

  /** @test {Routes#constructor} */
  it('should register the routes when creating a new Routes object', () => {
    new Routes({}, { app }) // eslint-disable-line no-new
  })

  /** @test {Routes#_registerControllers} */
  it('should register a controller', () => {
    const exp = express()
    const registered = routes._registerControllers(exp, {}, controllers)

    expect(registered).to.be.undefined
  })

  /** @test {Routes#_convertErrors} */
  it('should catch a 500 internal server error with a default error', done => {
    chai.request(app).get('/error')
      .then(done)
      .catch(err => {
        expect(err).to.have.status(500)
        done()
      })
  })

  /** @test {routes#_setNotFoundHandler} */
  it('should catch a 404 not found error', done => {
    chai.request(app).get('/not-found')
      .then(done)
      .catch(err => {
        expect(err).to.have.status(404)
        done()
      })
  })

  /**
   * Helper function for the '_setErrorHandler' method.
   * @param {!string} env - The value for the NODE_ENV stub.
   * @returns {undefined}
   */
  function testErrorHandler(env: string): void {
    /** @test {routes#_setErrorHandler} */
    it('should catch a 500 internal server error with a cutom error', done => {
      const stub = sinon.stub(process, 'env')
      stub.value({
        NODE_ENV: env
      })

      chai.request(app).get('/custom-error').then(res => {
        stub.restore()
        done(res)
      }).catch(err => {
        expect(err).to.have.status(500)
        stub.restore()

        done()
      })
    })
  }

  // Execute the tests.
  ['development', 'test'].map(testErrorHandler)

  /** @test {Routes#_addSecHeaders} */
  it('should add the security headers', done => {
    chai.request(app).get('/hello/world').then(res => {
      expect(res).to.have.status(200)
      expect(res).to.have.header('X-Content-Type-Options', 'no-sniff')
      expect(res).to.have.header('X-Frame-Options', 'deny')
      expect(res).to.have.header(
        'Content-Security-Policy',
        'default-src: \'none\''
      )

      done()
    }).catch(done)
  })

  /** @test {Routes#_removeSecHeaders} */
  it('should remove the security headers', done => {
    chai.request(app).get('/hello/world').then(res => {
      expect(res).to.have.status(200)
      expect(res).to.not.have.header('X-Powered-By')
      expect(res).to.not.have.header('X-AspNet-Version')
      expect(res).to.not.have.header('Server')

      done()
    }).catch(done)
  })

  /** @test {Routes#_setupExpress} */
  it('should setup the Express instance', () => {
    const exp = express()
    const PopApi = {}
    new Logger(PopApi, { // eslint-disable-line no-new
      name,
      logDir: join(...[
        __dirname,
        '..',
        '..',
        'tmp'
      ]),
      type: 'express'
    })

    routes._setupExpress(exp, PopApi.expressLogger)
    expect(express).to.not.equal(express())
  })

  /** @test {Routes#_setupExpress} */
  it('should setup the Express instance', () => {
    const exp = express()
    routes._setupExpress(exp)
    expect(express).to.not.equal(express())
  })
})
