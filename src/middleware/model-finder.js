'use strict';

const users = require('../auth/models/users-model.js');

function gettingModel(req, res, next) {
  let model = req.params.model;
  switch (model) {
  case 'users':
    req.model = users;
    next();
    return;
  default:
    next('Invalid Model');
    return;
  }
}
  
module.exports.gettingModel = gettingModel;