'use strict';
const express = require('express');
const router = express.Router();
const users = require('./models/users-model');
const basic = require('./middleware/basic.js');
const modelFinder = require('../middleware/model-finder.js');

router.param('model', modelFinder.gettingModel);

router.post('/signup', signupHandler);
router.post('/signin', basic, signinHandler);
router.get('/:model', usersHandler);


async function signupHandler(req, res, next) {
  let model = req.body;
  let modelll = await users.create(model);
    res.status(200).json(modelll);
    const token = users.generateToken(mpdel);
      // console.log('token',token);
      return token;
  

}

function signinHandler(req, res, next) {
  console.log('signinHandler');
  res.json({ token: req.token,
  user: req.user 
}).catch(next);
}

async function usersHandler(req, res, next) {
  console.log('inside users');
  let modelll = await req.model.list();
  // console.log('all users',modelll);
  res.json({count:modelll.length, results: modelll});
}



module.exports = router;