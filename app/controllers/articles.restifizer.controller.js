/**
 * Created by vedi on 11/15/13.
 */
'use strict';
var
  _ = require('lodash'),
  Q = require('q'),
  HTTP_STATUSES = require('http-statuses'),
  Article = require('mongoose').model('Article'),
  BaseController = require('./base.restifizer.controller.js')
  ;

var ArticleController = BaseController.extend({
  ModelClass: Article,
  path: '/api/articles',
  fields: ['title', 'content', 'user', 'created'],
  qFields: ['title'],
  defaultOptions: _.defaults({
    queryPipe: function (query, req, res, callback) {
      return query.populate('user', 'displayName', callback);
    }
  }, BaseController.prototype.defaultOptions),
  updateOptions: {
    pre: function (req, res, callback) {
      if (req.restifizer.action !== 'delete' && req.param('user') !== req.user.id) {
        return callback(HTTP_STATUSES.FORBIDDEN.createError('Cannot change alone articles'));
      }
      callback();
    }
  },
  prepareData: function (req, res, callback) {
    callback(null, {user: req.user});
  },
  beforeDelete: function (doc, req, callback) {
    if (doc.user.toString() !== req.user.id) {
      return callback(HTTP_STATUSES.FORBIDDEN.createError('Cannot change alone articles'));
    }
    callback();
  }
});

module.exports = ArticleController;

