'use strict';

const base64 = require('base-64');
const users = require('../models/users-schema');

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
    next('Missing Headers!');
    return;

  }  
  // user:pass
  const authBasic = req.headers.authorization.split(' ').pop(); // ["basic YWhtYWRfc2hlbGEgOjEyMzQ="]
  console.log('authBasic', authBasic);

  let [username, pass] = base64.decode(authBasic).split(':'); // "Raghad:1234"
  // const [userName, pass] = base64.decode(auth[1]).split(':'); /// if we did not use pop
  console.log('__BasicAuth__', username, pass);
  // we have the user obj
  users.authenticate(username, pass).then(validUser => {
    console.log('validUser ....basic',validUser);
    if (!validUser) {
      return next('Wrong Useranem or Password');
    }
    // generate a token for this user and return
    console.log('validUser', validUser);

    let token = users.generateToken(validUser.username);
    if (token) {
      req.basicAuth = {
        token: token,
        user: validUser,
      };
    }
    next();

  }).catch(err => next(err));

  
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
