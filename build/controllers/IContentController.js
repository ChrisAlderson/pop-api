'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _IController = require('./IController');

var _IController2 = _interopRequireDefault(_IController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class IContentController extends _IController2.default {
  getContents(req, res, next) {
    throw new Error('Using default method: \'getContents\'');
  }

  sortContent(sort, order) {
    throw new Error('Using default method: \'sortContent\'');
  }

  getPage(req, res, next) {
    throw new Error('Using default method: \'getPage\'');
  }

  getContent(req, res, next) {
    throw new Error('Using default method: \'getContent\'');
  }

  createContent(req, res, next) {
    throw new Error('Using default method: \'createContent\'');
  }

  updateContent(req, res, next) {
    throw new Error('Using default method: \'updateContent\'');
  }

  deleteContent(req, res, next) {
    throw new Error('Using default method: \'deleteContent\'');
  }

  getRandomContent(req, res, next) {
    throw new Error('Using default method: \'getRandomContent\'');
  }

}
exports.default = IContentController;