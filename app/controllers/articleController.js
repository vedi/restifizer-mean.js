/**
 * Created by vedi on 11/15/13.
 */
'use strict';
var
  _ = require('lodash'),
  Q = require('q'),
  Article = require('mongoose').model('Article'),
  BaseController = require('./baseController')
;

var ArticleController = BaseController.extend({
  ModelClass: Article,
  path: '/api/articles',
  fields: ['title', 'content', 'user', 'created'],
  qFields: ['title'],
  defaultOptions: {
    queryPipe: function (query, req, res, callback) {
      return query.populate('user', 'displayName', callback);
    }
  },
  prepareData: function (req, res, callback) {
    callback(null, {user: req.user});
  }
});
module.exports = ArticleController;

