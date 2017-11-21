// Import the necessary modules.
/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
// @flow
import express, { type $Application } from 'express'
import { join } from 'path'

import ContentService from '../../src/controllers/ContentService'
import Logger from '../../src/middleware/Logger'
import Routes from '../../src/middleware/Routes'
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
      constructor: {
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

    routes = new Routes({}, {
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
