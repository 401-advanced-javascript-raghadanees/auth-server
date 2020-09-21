'use strict';
const mongoose = require('mongoose');

const user = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String },
  // role: { type: String, enum: ['admin', 'editor', 'writer', 'user'] },
});


module.exports = mongoose.model('user', user);