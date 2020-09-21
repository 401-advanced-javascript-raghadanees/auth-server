'use strict';
const schema = require('./users-schema');
const Model = require('./model.js');

class users extends Model {
  constructor() {
    super(schema);
  }
}

module.exports = new users();