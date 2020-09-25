'use strict';
const express = require('express');
const router = express.Router();

const users = require('./models/users-schema');
const basicAuth = require('./middleware/basic.js');
const bearerAuth = require('./middleware/bearer.js');


// const aclPermission = require('./middleware/acl')



router.post('/signup', signupHandler);
router.post('/signin', basicAuth, signinHandler);
router.get('/users', basicAuth, usersHandler);
router.get('/secret', bearerAuth, handleSecret);

// router.get()

/**
 * for signup 
 * @param {object} req 
 * @param {object} res 
 */

async function signupHandler(req, res) {
    users.findOne({ username: req.body.username }).then(results => {
      console.log('req.body.username in router', req.body.username);

      if (results) {
          res.send('username is already exists! please choose another one');
      } else {
          let user = new users(req.body);

          user.save().then((user) => { 
              let token = users.generateToken(user.username); 
              res.status(200).send(token);
          });
      }
  });
}

/**
 * for signin 
 * @param {object} req 
 * @param {object} res 
 */

function signinHandler(req, res) {
  console.log('req.basicAuth', req.basicAuth)
  if (req.basicAuth) {
  // add the token as cookie 
        res.cookie('token', req.basicAuth.token);
        // add a header
        res.set('token', req.basicAuth.token);
        // send json object with token and user record
        res.status(200).json(req.basicAuth);
    } else {
        res.status(403).send('Invalid login signinHandler');
    }
}
/**
 * for getting all users 
 * @param {object} req 
 * @param {object} res 
 */

 function usersHandler(req, res) {
  if (req.basicAuth.token) {
    users.find().then(result => {
        // res.status(200).json(result);
        res.status(200).json({numberOfUsers: result.length, TheList: result});
    });
} else {
    res.status(403).send('Invalid login ,,,usersHandler ');
}
}

/**
 * 
 * @param {object} req 
 * @param {object} res 
 */
function handleSecret(req, res) {
  console.log('req.user',req.user);
  res.status(200).send(req.user);
}


module.exports = router;