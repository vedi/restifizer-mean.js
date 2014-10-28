/**
 * Created by vedi on 11/15/13.
 */
'use strict';
var
  mongoose = require('mongoose');

// AccessToken

var AccessToken = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  clientId: {
    type: String,
    required: true
  },
  token: {
    type: String,
    unique: true,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  scopes: {
    type: [String],
    required: true
  }
});

mongoose.model('AccessToken', AccessToken);
