'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // Import the necessary modules.


var _pMap = require('p-map');

var _pMap2 = _interopRequireDefault(_pMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * ContentService class for the CRUD operations.
 * @type {ContentService}
 */
class ContentService {

  /**
   * Create a new ContentService.
   * @param {!Object} options - The options for the content service.
   * @param {!Model} options.Model - The model of the service.
   * @param {!string} options.itemType - The item type of the service.
   * @param {!Object} options.projection - The projection of the service.
   * @param {!Object} options.query - The query of the service.
   * @param {!number} [options.pageSize=25] - The page size of the service.
   */


  /**
   * The query of the service.
   * @type {Object}
   */


  /**
   * The maximum items to display per page.
   * @type {number}
   */
  constructor({
    Model,
    itemType,
    projection,
    query,
    pageSize = 25
  }) {
    /**
     * The item type of the service.
     * @type {Model}
     */
    this.Model = Model;
    /**
     * The maximum items to display per page.
     * @type {number}
     */
    this.pageSize = pageSize;
    /**
     * Simple projection for showing multiple content items.
     * @type {Object}
     */
    this.projection = projection;
    /**
     * Query to only get the content items.
     * @type {Object}
     */
    this.query = query;
    /**
     * The model of the servece.
     * @type {string}
     */
    this.itemType = itemType;
  }

  /**
   * Get all the available pages.
   * @param {!string} [base='/'] - The base of the url to display.
   * @returns {Promise<Array<string>, Error>} - A list of pages which are
   * available.
   */


  /**
   * The item type of the service.
   * @type {string}
   */


  /**
   * Simple projection for showing multiple content items.
   * @type {Object}
   */


  /**
   * The model of the service.
   * @type {Model}
   */
  getContents(base = '/') {
    return this.Model.count(this.query).then(count => {
      const pages = Math.ceil(count / this.pageSize);
      const docs = [];

      for (let i = 1; i < pages + 1; i++) {
        docs.push(`${base}${this.itemType}/${i}`);
      }

      return docs;
    });
  }

  /**
   * Get content from one page.
   * @param {?Object} sort - The sort object to sort and order content.
   * @param {!number} [p=1] - The page to get.
   * @param {!Object} [query=this.query] - A copy of the query object to
   * get the objects.
   * @returns {Promise<Array<Model>, Error>} - The content of one page.
   */
  getPage(sort, p = 1, query = _extends({}, this.query)) {
    const page = !isNaN(p) ? Number(p) - 1 : 0;
    const offset = page * this.pageSize;

    let aggregateQuery = [{
      $match: query
    }, {
      $project: this.projection
    }];

    if (sort) {
      aggregateQuery = [{
        $sort: sort
      }, ...aggregateQuery];
    }

    if (typeof p === 'string' && p.toLowerCase() === 'all') {
      return this.Model.aggregate(aggregateQuery);
    }

    aggregateQuery = [...aggregateQuery, {
      $skip: offset
    }, {
      $limit: this.pageSize
    }];

    return this.Model.aggregate(aggregateQuery);
  }

  /**
   * Get the content from the database with an id.
   * @param {!string} id - The id of the content to get.
   * @param {!Object} projection - The projection for the content.
   * @returns {Promise<Model, Error>} - The details of the content.
   */
  getContent(id, projection) {
    return this.Model.findOne({
      _id: id
    }, projection);
  }

  /**
   * Insert the content into the database.
   * @param {!Object} obj - The object to insert.
   * @returns {Promise<Model, Error>} - The created content.
   */
  createContent(obj) {
    return new this.Model(obj).save();
  }

  /**
   * Insert multiple content models into the database.
   * @param {!Array<Object>} arr - The array of content to insert.
   * @returns {Promise<Array<Model>, Error>} - The inserted content.
   */
  createMany(arr) {
    var _this = this;

    return (0, _pMap2.default)(arr, (() => {
      var _ref = _asyncToGenerator(function* (obj) {
        const found = yield _this.Model.findOne({
          _id: obj.slug
        });

        return found ? _this.updateContent(obj.slug, obj) : _this.createContent(obj);
      });

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    })(), {
      concurrency: 1
    });
  }

  /**
   * Update the content.
   * @param {!string} id - The id of the content to get.
   * @param {!Object} obj - The object to update.
   * @returns {Promise<Model, Error>} - The updated content.
   */
  updateContent(id, obj) {
    return this.Model.findOneAndUpdate({
      _id: id
    }, new this.Model(obj), {
      upsert: true,
      new: true
    });
  }

  /**
   * Update multiple content models into the database.
   * @param {!Array<Object>} arr - The array of content to update.
   * @returns {Promise<Array<Model>, Error>} - The updated content.
   */
  updateMany(arr) {
    return this.createMany(arr);
  }

  /**
   * Delete a content model.
   * @param {!string} id - The id of the content to delete.
   * @returns {Promise<Model, Error>} - The deleted content.
   */
  deleteContent(id) {
    return this.Model.findOneAndRemove({
      _id: id
    });
  }

  /**
   * Delete multiple content models from the database.
   * @param {!Array<Object>} arr - The array of content to delete.
   * @returns {Promise<Array<Model>, Error>} - The deleted content.
   */
  deleteMany(arr) {
    return (0, _pMap2.default)(arr, obj => this.deleteContent(obj._id));
  }

  /**
   * Get random content.
   * @returns {Promise<Model, Error>} - Random content.
   */
  getRandomContent() {
    return this.Model.aggregate([{
      $match: this.query
    }, {
      $project: this.projection
    }, {
      $sample: {
        size: 1
      }
    }, {
      $limit: 1
    }]).then(([res]) => res);
  }

}
exports.default = ContentService;