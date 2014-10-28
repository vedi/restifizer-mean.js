'use strict';

require('../app/models/client.server.model');

var
  Q = require('q'),
  init = require('../config/init')(),
  Client = require('mongoose').model('Client'),
  log = require('../config/log')(module)
  ;

require('../config/mongoose')();

exports.up = function (next) {
  Q
    .try(function () {
      log.info("Create default client");
      var client = new Client({ name: 'default', clientId: 'default', clientSecret: 'he2rapRA' });
      return Q.ninvoke(client, "save");
    })
    .then(function () {
      next();
    })
    .catch(function (err) {
      log.error("Error", err);
      next(err);
    })
  ;
};

exports.down = function (next) {
  Q
    .try(function () {
      log.info("Remove default client");
      return Q.ninvoke(Client, 'remove', { clientId: 'default' });
    })
    .then(function () {
      next();
    })
    .catch(function (err) {
      log.error("Error", err);
      next(err);
    })
  ;
};
