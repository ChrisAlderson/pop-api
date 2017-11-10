'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _IController = require('./IController');

var _IController2 = _interopRequireDefault(_IController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Interface for handling the content endpoints.
 * @interface
 * @type {IContentController}
 * @implements {IController}
 */
class IContentController extends _IController2.default {

  /**
   * Default method to get content pages.
   * @abstract
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @throws {Error} - Using default method: 'getContents'.
   * @returns {Promise<Array<string>, Object>} - A list of pages which are
   * available.
   */
  getContents(req, res) {
    throw new Error('Using default method: \'getContents\'');
  }

  /**
   * Default method to sort the items.
   * @abstract
   * @param {!string} sort - The property to sort on.
   * @param {!number} order - The way to sort the property.
   * @throws {Error} - Using default method: 'sortContent'
   * @returns {Object} - The sort object.
   */
  sortContent(sort, order) {
    throw new Error('Using default method: \'sortContent\'');
  }

  /**
   * Default method to get a page of content.
   * @abstract
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @throws {Error} - Using default method: 'getPage'.
   * @returns {Promise<Array<Object>, Object>} - The content of one page.
   */
  getPage(req, res) {
    throw new Error('Using default method: \'getPage\'');
  }

  /**
   * Get a content item based on the id.
   * @abstract
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @throws {Error} - Using default method: 'getContent'.
   * @returns {Promise<Object, Object>} - The details of a single content item.
   */
  getContent(req, res) {
    throw new Error('Using default method: \'getContent\'');
  }

  /**
   * Create a new content item.
   * @abstract
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @throws {Error} - Using default method: 'createContent'.
   * @returns {Promise<Object, Object>} - The created content item.
   */
  createContent(req, res) {
    throw new Error('Using default method: \'createContent\'');
  }

  /**
   * Update the info of one content item.
   * @abstract
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @throws {Error} - Using default method: 'updateContent'.
   * @returns {Promise<Object, Object>} - The updated content item.
   */
  updateContent(req, res) {
    throw new Error('Using default method: \'updateContent\'');
  }

  /**
   * Delete a content item.
   * @abstract
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @throws {Error} - Using default method: 'deleteContent'.
   * @returns {Promise<Object, Object>} - The deleted content item
   */
  deleteContent(req, res) {
    throw new Error('Using default method: \'deleteContent\'');
  }

  /**
   * Default method to get a random content item.
   * @abstract
   * @param {!Object} req - The ExpressJS request object.
   * @param {!Object} res - The ExpressJS response object.
   * @throws {Error} - Using default method: 'getRandomContent'.
   * @returns {Promise<Object, Object>} - A random item.
   */
  getRandomContent(req, res) {
    throw new Error('Using default method: \'getRandomContent\'');
  }

}
exports.default = IContentController; // Import the necessary modules.