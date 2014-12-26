/**
 * Created by vedi on 07/05/14.
 */
'use strict';
var
  Restifizer = require('restifizer').Restifizer,
  passport = require('oauthifizer').passport,
  User = require('mongoose').model('User');

var BaseController = Restifizer.Controller.extend({
  hasRole: function (req, role) {
    return req.user &&
      req.user.roles &&
      req.user.roles.indexOf(role) >= 0;
  },
  isAdmin: function (req) {
    return this.hasRole(req, User.ROLES.ADMIN);
  },
  isSeller: function (req) {
    return this.hasRole(req, User.ROLES.SELLER);
  },
  defaultOptions: {
    enabled: true,
    auth: ['bearer', 'session']
  },
  getAuth: function (options) {
    var auths = [
      passport.authenticate(options.auth, { session: false }),
      function (req, res, next) {
        if (!req.isAuthenticated()) {
          //options
          return res.status(401).send({
            message: 'User is not logged in'
          });
        }

        next();
      }
    ];
    return options.auth ? auths : this._emptyPre;
  }
});

module.exports = BaseController;
