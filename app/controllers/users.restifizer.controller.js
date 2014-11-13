/**
 * Created by vedi on 11/15/13.
 */
'use strict';
var
  _ = require('lodash'),
  Q = require('q'),
  User = require('mongoose').model('User'),
  BaseController = require('./base.server.controller'),
  HTTP_STATUSES = require('http-statuses')
;

var allowForOwn = function (req, res, next) {
  if (!req.authInfo || (!this.isAdmin(req) && (!req.params._id || req.params._id !== req.user.id))) {
    next(HTTP_STATUSES.FORBIDDEN.createError());
  } else {
    next();
  }
};

var filterOwnFields = function (req, user, insert) {
  if (!insert && !this.isAdmin(req) && (!req.user || user.id !== req.user.id)) {
    if (user.login) {
      user.login = '***';
    }
    if (user.scopes) {
      user.scopes = [];
    }
  }
};

module.exports = BaseController.extend({
  ModelClass: User,
  path: '/api/users',
  fields: ['firstName', 'lastName', 'displayName', 'email', 'username', 'provider', 'roles', 'updated', 'created'],
  qFields: ['firstName', 'lastName', 'displayName', 'username', 'email'],
  selectOptions: {
    pre: function (req, res, next) {
      if (req.restifizer.action === 'selectOne') {
        if (req.params._id === 'me') {
          req.params._id = req.user.id;
        }
      }
      next();
    },
    post: function (result, req, res, callback) {
      filterOwnFields.call(this, req, result);
      callback(null, result);
    }
  },
  insertOptions: {
    auth: ['bearer', 'oauth2-client-password'],
    pre: function (req, res, next) {
      // set defaults
      req.params.scopes = ['own'];
      req.authInfo.scope = 'own';
      next();
    },
    post: function (user, req, res, callback) {
      filterOwnFields.call(this, req, user, true);
      callback(null, user);
    }
  },
  updateOptions: {
    pre: allowForOwn,
    post: function (result, req, res, callback) {
      filterOwnFields.call(this, req, result);
      callback(null, result);
    }
  },
  deleteOptions: {
    pre: allowForOwn
  },
  assignFilter: function (dest, source, fieldName, req) {
    var fieldValue = source[fieldName];
    // skip empty password
    // skip roles not from admins
    return (fieldName !== 'password' || (fieldValue && fieldValue.length !== 0)) &&
      (fieldName !== 'roles' ||
      this.isAdmin(req) ||
      (fieldValue && fieldValue.length === 1 && fieldValue[0] === 'user'));
  }
});

