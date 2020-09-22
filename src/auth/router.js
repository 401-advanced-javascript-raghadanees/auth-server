'use strict';
const express = require('express');
const router = express.Router();
const users = require('./models/users-model');
const basicAuth = require('./middleware/basic.js');
const modelFinder = require('../middleware/model-finder.js');

router.param('model', modelFinder.gettingModel);

router.post('/signup', signupHandler);
router.post('/signin', basicAuth, signinHandler);
router.get('/:model', usersHandler);


/**
 * for signup 
 * @param {object} req 
 * @param {object} res 
 */

async function signupHandler(req, res) {
  let model = req.body;
  try {
    let modelll = await users.create(model);
    res.status(200).json(modelll);
    const token = users.generateToken(model);
    console.log('token',token);
    return token;

  } catch(error){
    console.log('err', error);
  }
}

/**
 * for signin 
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 */

function signinHandler(req, res, next) {
  console.log('signinHandler');
  res.json({ token: req.token,
    user: req.user, 
  });
}
/**
 * for getting all users 
 * @param {object} req 
 * @param {object} res 
 * @param {object} next 
 */

async function usersHandler(req, res, next) {
  console.log('model <<< users');
  let modelll = await req.model.list();
  // console.log('all users',modelll);
  res.json({count:modelll.length, results: modelll});
}



module.exports = router;