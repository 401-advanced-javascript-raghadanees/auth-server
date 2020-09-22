'use strict';


const Users = require('../models/users-model');

module.exports = (req, res, next) => {

  if (!req.headers.authorization) {
    return next('invalid Login , No Header !!');
  }
  
console.log('req.headers.authorization', req.headers.authorization)
  let bearer = req.headers.authorization.split(' ');
  console.log('bearer.............', bearer);
  if (bearer[0] == 'Bearer') {
    const token = bearer[1];
    console.log('token.............', token);

    Users.authenticateToken(token).then(validUser => {

      console.log('validUser........', validUser);
      req.user = validUser;
      next();
    }).catch(err => next('Invalid Token !'));
  } else {
    return next(' Invalid Bearer');
  }

};