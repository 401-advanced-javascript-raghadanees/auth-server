'use strict';

const base64 = require('base-64');
const users = require('../models/users-model');

/**
 * // this is used for signin authorization
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 */

module.exports = (req, res, next) => {
  // check if the client sent authorization headers
  // headers = {}
  console.log('req.headers.authorization', req.headers.authorization);
  if (!req.headers.authorization) {
    next('Invalid Login');
  } else {
    // user:pass
    const authBasic = req.headers.authorization.split(' ').pop(); // ["basic YWhtYWRfc2hlbGEgOjEyMzQ="]
    console.log('authBasic', authBasic);
    let [userName, pass] = base64.decode(authBasic).split(':'); // "Raghad:1234"
    // const [userName, pass] = base64.decode(auth[1]).split(':'); /// if we did not use pop
    console.log('__BasicAuth__', userName, pass);
    // we have the user obj
    users.authenticate(userName, pass).then((validUser) => {

      // generate a token for this user and return
      console.log('validUser', validUser);

      req.token = users.generateToken(validUser);
      req.userName = validUser;
      console.log('req.token', req.token);
      next();
    }).catch((err) => next(err));
  }
};

/*
headers:{
  "authorization":"Basic YWhtYWRfc2hlbGEgOjEyMzQ="
}

 // pass the username and password to this method;
    // Basic Authentication (HTTP Headers)
    // we expect to have req headers
    // Basic YWhtYWRfc2hlbGEgOjEyMzQ=
*/
