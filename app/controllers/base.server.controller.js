/**
 * Created by vedi on 07/05/14.
 */
'use strict';
var
  Restifizer = require('restifizer').Restifizer,
  passport = require('oauthifizer').passport;

var BaseController = Restifizer.Controller.extend({
  isAdmin: function (req) {
    return req.authInfo &&
      req.authInfo.scope &&
      req.authInfo.scope.indexOf('all') >= 0;
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
