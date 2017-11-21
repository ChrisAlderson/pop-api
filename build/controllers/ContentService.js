'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _pMap = require('p-map');

var _pMap2 = _interopRequireDefault(_pMap);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ContentService {
  constructor({
    Model,
    itemType,
    projection,
    query,
    pageSize = 25
  }) {
    this.Model = Model;

    this.pageSize = pageSize;

    this.projection = projection;

    this.query = query;

    this.itemType = itemType;
  }

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

  getContent(id, projection) {
    return this.Model.findOne({
      _id: id
    }, projection);
  }

  createContent(obj) {
    return new this.Model(obj).save();
  }

  createMany(arr) {
    return (0, _pMap2.default)(arr, async obj => {
      const found = await this.Model.findOne({
        _id: obj.slug
      });

      return found ? this.updateContent(obj.slug, obj) : this.createContent(obj);
    }, {
      concurrency: 1
    });
  }

  updateContent(id, obj) {
    return this.Model.findOneAndUpdate({
      _id: id
    }, new this.Model(obj), {
      upsert: true,
      new: true
    });
  }

  updateMany(arr) {
    return this.createMany(arr);
  }

  deleteContent(id) {
    return this.Model.findOneAndRemove({
      _id: id
    });
  }

  deleteMany(arr) {
    return (0, _pMap2.default)(arr, obj => this.deleteContent(obj._id));
  }

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