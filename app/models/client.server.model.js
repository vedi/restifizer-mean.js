'use strict';
var
  mongoose = require('mongoose');

// Client
var Client = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  clientId: {
    type: String,
    unique: true,
    required: true
  },
  clientSecret: {
    type: String,
    required: true
  }
});

mongoose.model('Client', Client);
