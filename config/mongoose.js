/**
 * Created by vedi on 27/10/14.
 */
'use strict';

var
  mongoose = require('mongoose'),
  config = require('./config');

// Bootstrap db connection
module.exports = function() {
  return mongoose.connect(config.db, function (err) {
    if (err) {
      console.error('\x1b[31m', 'Could not connect to MongoDB!');
      console.log(err);
    }
  });
};
