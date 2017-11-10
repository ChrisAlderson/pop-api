// Import the necessary modules.
import bodyParser from 'body-parser'
import chai, { expect } from 'chai'
// @flow
/* eslint-disable no-unused-expressions */
import chaiHttp from 'chai-http'
import Express, { type $Application } from 'express'
import sinon from 'sinon'

import BaseContentController from '../../src/controllers/BaseContentController'
import ContentService from '../../src/controllers/ContentService'
import Database from '../../src/middleware/Database'
import {
  ExampleModel,
  exampleModel1,
  exampleModel2
} from '../../examples'
import { name } from '../../package'

/**
 * The base endpoint to test.
 * @type {string}
 */
const content: string = 'example'

/** @test {BaseContentController} */
describe('BaseContentController', () => {
  /**
   * The base content controller object to test.
   * @type {BaseContentController}
   */
  let baseContentController: BaseContentController

  /**
   * The express instance to test with.
   * @type {Express}
   */
  let app: $Application

  /**
   * The database middleware to connect to the MongoDb instance.
   * @type {Database}
   */
  let database: Database

  /**
   * The id of the content to get.
   * @type {string}
   */
  let id: string

  /**
   * Hook for setting up the base content controller tests.
   * @type {Function}
   */
  before(done => {
    chai.use(chaiHttp)

    app = Express()
    app.use(bodyParser.urlencoded({
      extended: true
    }))
    app.use(bodyParser.json())

    baseContentController = new BaseContentController({
      service: new ContentService({
        Model: ExampleModel,
        itemType: content,
        projection: {
          name: 1
        },
        query: {}
      })
    })
    baseContentController.registerRoutes(app)

    database = new Database({}, {
      database: name
    })
    database.connectMongoDb()
      .then(() => done())
      .catch(done)
  })

  /** @test {BaseContentController#constructor} */
  it('should check the attributes of the BaseContentController', () => {
    expect(baseContentController._service).to.be.an('object')
  })

  /** @test {BaseContentController} */
  describe('with an empty database', () => {
    /**
     * Hook for setting up the AudioController tests.
     * @type {Function}
     */
    before(done => {
      ExampleModel.remove({}).exec()
        .then(() => done())
        .catch(done)
    })

    /**
     * Expectations for a no content (204) result.
     * @param {!Object} res - The result to test.
     * @param {!Function} done - The done function of Mocha.
     * @returns {undefined}
     */
    function expectNoContent(res: Object, done: Function): void {
      expect(res).to.have.status(204)
      expect(res).to.not.redirect

      done()
    }

    /** @test {BaseContentController#getContents} */
    it(`should get a 204 status from the GET [/${content}s] route`, done => {
      chai.request(app).get(`/${content}s`)
        .then(res => expectNoContent(res, done))
        .catch(done)
    })

    /** @test {BaseContentController#getPage} */
    it(`should get a 204 status from the GET [/${content}s/:page] route`, done => {
      chai.request(app).get(`/${content}s/1`)
        .then(res => expectNoContent(res, done))
        .catch(done)
    })

    /** @test {BaseContentController#getContent} */
    it(`should get a 204 status from the GET [/${content}/:id] route`, done => {
      chai.request(app).get(`/${content}/${id}`)
        .then(res => expectNoContent(res, done))
        .catch(done)
    })

    /** @test {BaseContentController#getRandomContent} */
    it(`should get a 204 status from the GET [/random/${content}] route`, done => {
      chai.request(app).get(`/random/${content}`)
        .then(res => expectNoContent(res, done))
        .catch(done)
    })
  })

  /** @test {BaseContentController} */
  describe('with a filled database', () => {
    /**
     * The query object passed along to the 'getAudios' tests.
     * @type {Object}
     */
    let query: Object

    /**
     * Hook for setting up the AudioController tests.
     * @type {Function}
     */
    before(done => {
      query = {
        order: -1
      }

      done()
    })

    /**
     * Expectations for a ok result.
     * @param {!Object} res - The result to test.
     * @param {!Function} [done=() => {}] - The done function of Mocha.
     * @returns {undefined}
     */
    function expectOk(res: Object, done: Function = () => {}): void {
      expect(res).to.have.status(200)
      expect(res).to.be.json
      expect(res).to.not.redirect

      done()
    }

    /** @test {BaseContentController#createContent} */
    it(`should get a 200 status from the POST [/${content}s] route`, done => {
      chai.request(app).post(`/${content}s`)
        .send(exampleModel1)
        .then(res => expectOk(res, done))
        .catch(() => done)
    })

    /** @test {BaseContentController#getContents} */
    it(`should get a 200 status from the GET [/${content}s] route`, done => {
      chai.request(app).get(`/${content}s`)
        .then(res => expectOk(res, done))
        .catch(done)
    })

    /** @test {BaseContentController#getPage} */
    it(`should get a 200 status from the GET [/${content}s/:page] route`, done => {
      chai.request(app).get(`/${content}s/1`).query({
        ...query,
        sort: 'name'
      }).then(res => expectOk(res, done))
        .catch(done)
    })

    /** @test {BaseContentController#getPage} */
    it(`should get a 200 status from the GET [/${content}s/:page] route`, done => {
      chai.request(app).get(`/${content}s/1`).query({
        ...query
      }).then(res => {
        expectOk(res)

        const random = Math.floor(Math.random() * res.body.length)
        id = res.body[random]._id

        done()
      }).catch(done)
    })

    /** @test {BaseContentController#updateContent} */
    it(`should get a 200 status from the PUT [/${content}/:id] route`, done => {
      const { name } = exampleModel2
      chai.request(app).put(`/${content}/${id}`)
        .send({ name })
        .then(res => expectOk(res, done))
        .catch(done)
    })

    /** @test {BaseContentController#getContent} */
    it(`should get a 200 status from the GET [/${content}/:id] route`, done => {
      chai.request(app).get(`/${content}/${id}`)
        .then(res => expectOk(res, done))
        .catch(done)
    })

    /** @test {BaseContentController#getRandomContent} */
    it(`should get a 200 status from the GET [/random/${content}] route`, done => {
      chai.request(app).get(`/random/${content}`)
        .then(res => expectOk(res, done))
        .catch(done)
    })

    /** @test {BaseContentController#deleteContent} */
    it(`should get a 200 status from the DELETE [/${content}/:id] route`, done => {
      chai.request(app).delete(`/${content}/${id}`)
        .then(res => expectOk(res, done))
        .catch(done)
    })
  })

  /** @test {BaseContentController} */
  describe('will throw errors', () => {
    /**
     * Expectations for an internal server error result.
     * @param {!Object} err - The result to test.
     * @param {!Object} stub - The stub which made the internal server error.
     * @param {!Function} done - The done function of Mocha.
     * @returns {undefined}
     */
    function expectInternalError(err, stub, done): void {
      expect(err).to.have.status(500)
      expect(err).to.not.redirect

      stub.restore()
      done()
    }

    /** @test {BaseContentController#createContent} */
    it(`should get a 500 status from the POST [/${content}/:id] route`, done => {
      chai.request(app).post(`/${content}s`)
        .then(done)
        .catch(err => {
          expect(err).to.have.status(500)
          expect(err).to.not.redirect

          done()
        })
    })

    /** @test {BaseContentController#getContents} */
    it(`should get a 500 status from the GET [/${content}s] route`, done => {
      const stub = sinon.stub(ExampleModel, 'count')
      stub.rejects()

      chai.request(app).get(`/${content}s`)
        .then(done)
        .catch(err => expectInternalError(err, stub, done))
    })

    /** @test {BaseContentController#getPage} */
    it(`should get a 500 status from the GET [/${content}s/:page] route`, done => {
      const stub = sinon.stub(ExampleModel, 'aggregate')
      stub.rejects()

      chai.request(app).get(`/${content}s/1`)
        .then(done)
        .catch(err => expectInternalError(err, stub, done))
    })

    /** @test {BaseContentController#updateContent} */
    it(`should get a 500 status from the PUT [/${content}s] route`, done => {
      const stub = sinon.stub(ExampleModel, 'findOneAndUpdate')
      stub.rejects()

      chai.request(app).put(`/${content}/${id}`)
        .then(done)
        .catch(err => expectInternalError(err, stub, done))
    })

    /** @test {BaseContentController#getContent} */
    it(`should get a 500 status from the GET [/${content}/:id] route`, done => {
      const stub = sinon.stub(ExampleModel, 'findOne')
      stub.rejects()

      chai.request(app).get(`/${content}/${id}`)
        .then(done)
        .catch(err => expectInternalError(err, stub, done))
    })

    /** @test {BaseContentController#getRandomContent} */
    it(`should get a 500 status from the GET [/random/${content}] route`, done => {
      const stub = sinon.stub(ExampleModel, 'aggregate')
      stub.rejects()

      chai.request(app).get(`/random/${content}`)
        .then(done)
        .catch(err => expectInternalError(err, stub, done))
    })

    /** @test {BaseContentController#deleteContent} */
    it(`should get a 500 status from the DELETE [/${content}/:id] route`, done => {
      const stub = sinon.stub(ExampleModel, 'findOneAndRemove')
      stub.rejects()

      chai.request(app).delete(`/${content}/${id}`)
        .then(done)
        .catch(err => expectInternalError(err, stub, done))
    })
  })

  /**
   * Hook for tearing down the AudioController tests.
   * @type {Function}
   */
  after(done => {
    ExampleModel.findOneAndRemove({
      _id: exampleModel1._id
    }).exec()
      .then(() => database.disconnectMongoDb())
      .then(() => done())
      .catch(done)
  })
})
