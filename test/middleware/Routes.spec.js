// Import the necessary modules.
// @flow
/* eslint-disable no-unused-expressions */
import Express, { type $Application } from 'express'
import { expect } from 'chai'
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
   * The kxpress instance to test with.
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
    app = Express()
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
    const express = Express()
    const registered = routes._registerControllers(express, controllers)

    expect(registered).to.be.undefined
  })

  /** @test {Routes#_setupExpress} */
  it('should setup the Express instance', () => {
    const express = Express()
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

    routes._setupExpress(express, PopApi.expressLogger)
    expect(express).to.not.equal(Express())
  })

  /** @test {Routes#_setupExpress} */
  it('should setup the Express instance', () => {
    const express = Express()
    routes._setupExpress(express)
    expect(express).to.not.equal(Express())
  })
})
