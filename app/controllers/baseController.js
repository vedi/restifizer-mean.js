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
    auth: 'bearer'
  },
  getAuth: function (options) {
    return options.auth ? passport.authenticate(options.auth, { session: false }) : this._emptyPre;
  }
});

module.exports = BaseController;
