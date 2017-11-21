'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _IContentController = require('./IContentController');

var _IContentController2 = _interopRequireDefault(_IContentController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class BaseContentController extends _IContentController2.default {
  constructor({ service }) {
    super();

    this._service = service;
  }

  registerRoutes(router, PopApi) {
    const t = this._service.itemType;

    router.get(`/${t}s`, this.getContents.bind(this));
    router.get(`/${t}s/:page`, this.getPage.bind(this));
    router.get(`/${t}/:id`, this.getContent.bind(this));
    router.post(`/${t}s`, this.createContent.bind(this));
    router.put(`/${t}/:id`, this.updateContent.bind(this));
    router.delete(`/${t}/:id`, this.deleteContent.bind(this));
    router.get(`/random/${t}`, this.getRandomContent.bind(this));
  }

  _checkEmptyContent(res, content) {
    if (!content || content.length === 0) {
      return res.status(204).json();
    }

    return res.json(content);
  }

  getContents(req, res, next) {
    return this._service.getContents().then(content => this._checkEmptyContent(res, content)).catch(err => next(err));
  }

  sortContent(sort, order) {
    return {
      [sort]: order
    };
  }

  getPage(req, res, next) {
    const { page } = req.params;
    const { sort, order } = req.query;

    const o = parseInt(order, 10) ? parseInt(order, 10) : -1;
    const s = typeof sort === 'string' ? this.sortContent(sort, o) : null;

    return this._service.getPage(s, Number(page)).then(content => this._checkEmptyContent(res, content)).catch(err => next(err));
  }

  getContent(req, res, next) {
    return this._service.getContent(req.params.id).then(content => this._checkEmptyContent(res, content)).catch(err => next(err));
  }

  createContent(req, res, next) {
    return this._service.createContent(req.body).then(content => res.json(content)).catch(err => next(err));
  }

  updateContent(req, res, next) {
    return this._service.updateContent(req.params.id, req.body).then(content => res.json(content)).catch(err => next(err));
  }

  deleteContent(req, res, next) {
    return this._service.deleteContent(req.params.id).then(content => res.json(content)).catch(err => next(err));
  }

  getRandomContent(req, res, next) {
    return this._service.getRandomContent().then(content => this._checkEmptyContent(res, content)).catch(err => next(err));
  }

}
exports.default = BaseContentController;