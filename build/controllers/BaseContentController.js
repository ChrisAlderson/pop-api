'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _IContentController = require('./IContentController');

var _IContentController2 = _interopRequireDefault(_IContentController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Base class for getting content from endpoints.
 * @implements {IContentController}
 * @type {BaseContentController}
 */
// Import the necessary modules.
class BaseContentController extends _IContentController2.default {

  /**
   * Create a new base content controller.
   * @param {!Object} options - The options for the base content controller.
   * @param {!ContentService} options.service - The service for the content
   * controller.
   */
  constructor({ service }) {
    super();

    /**
     * The service of the content controller.
     * @type {ContentService}
     */
    this._service = service;
  }

  /**
   * Register the default methods to the default routes.
   * @param {!Express} app - The express instance to register the routes to.
   * @param {?PopApi} [PopApi] - The PopApi instance.
   * @throws {Error} - Using default method: 'registerRoutes'
   * @returns {undefined}
   */


  /**
   * The service of the content controller.
   * @type {ContentService}
   */
  registerRoutes(app, PopApi) {
    const t = this._service.itemType;

    app.get(`/${t}s`, this.getContents.bind(this));
    app.get(`/${t}s/:page`, this.getPage.bind(this));
    app.get(`/${t}/:id`, this.getContent.bind(this));
    app.post(`/${t}s`, this.createContent.bind(this));
    app.put(`/${t}/:id`, this.updateContent.bind(this));
    app.delete(`/${t}/:id`, this.deleteContent.bind(this));
    app.get(`/random/${t}`, this.getRandomContent.bind(this));
  }

  /**
   * Check if the content is empty or the length of the content array is zero.
   * @param {!Object} res - The ExpressJS response object.
   * @param {!Object|Array<Object>} content - The content to check.
   * @returns {Object} - Returns a 204 response if the content is empty, or a
   * 200 response with the content if it is not empty.
   */
  _checkEmptyContent(res, content) {
    if (!content || content.length === 0) {
      return res.status(204).json();
    }

    return res.json(content);
  }

  /**
   * Get all the available pages.
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @returns {Promise<Array<string>, Object>} - A list of pages which are
   * available.
   */
  getContents(req, res) {
    return this._service.getContents().then(content => this._checkEmptyContent(res, content)).catch(err => res.status(500).json(err));
  }

  /**
   * Default method to sort the items.
   * @param {!string} sort - The property to sort on.
   * @param {!number} order - The way to sort the property.
   * @returns {Object} - The sort object.
   */
  sortContent(sort, order) {
    return {
      [sort]: order
    };
  }

  /**
   * Get content from one page.
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @returns {Promise<Array<Object>, Object>} - The content of one page.
   */
  getPage(req, res) {
    const { page } = req.params;
    const { sort, order } = req.query;

    const o = parseInt(order, 10) ? parseInt(order, 10) : -1;
    const s = typeof sort === 'string' ? this.sortContent(sort, o) : null;

    return this._service.getPage(s, Number(page)).then(content => this._checkEmptyContent(res, content)).catch(err => res.status(500).json(err));
  }

  /**
   * Get a content item based on the id.
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @returns {Promise<Object, Object>} - The details of a single content item.
   */
  getContent(req, res) {
    return this._service.getContent(req.params.id).then(content => this._checkEmptyContent(res, content)).catch(err => res.status(500).json(err));
  }

  /**
   * Create a new content item.
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @returns {Promise<Object, Object>} - The created content item.
   */
  createContent(req, res) {
    return this._service.createContent(req.body).then(content => res.json(content)).catch(err => res.status(500).json(err));
  }

  /**
   * Update the info of one content item.
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @returns {Promise<Object, Object>} - The updated content item.
   */
  updateContent(req, res) {
    return this._service.updateContent(req.params.id, req.body).then(content => res.json(content)).catch(err => res.status(500).json(err));
  }

  /**
   * Delete a content item.
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @returns {Promise<Object, Object>} - The deleted content item
   */
  deleteContent(req, res) {
    return this._service.deleteContent(req.params.id).then(content => res.json(content)).catch(err => res.status(500).json(err));
  }

  /**
   * Get a random item.
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @returns {Promise<Object, Object>} - A random item.
   */
  getRandomContent(req, res) {
    return this._service.getRandomContent().then(content => this._checkEmptyContent(res, content)).catch(err => res.status(500).json(err));
  }

}
exports.default = BaseContentController;