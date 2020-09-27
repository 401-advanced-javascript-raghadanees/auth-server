'use strict';


const express = require('express');

const users = require('./models/users-schema');

const permissions = require('./middleware/acl');
const bearerAuth = require('./middleware/bearer');
const router = express.Router();


router.get('/secret', bearerAuth, handleSecret);

// these are for loggedin users >>>>>> access depen on thier roles
router.get('/read', bearerAuth, permissions('read'), readHandel);
router.post('/add', bearerAuth, permissions('create'), createHandel);
router.put('/change', bearerAuth, permissions('update'), updateHandel);
router.delete('/remove', bearerAuth, permissions('delete'),deleteHandel);


function handleSecret(req, res) {
  console.log('req.user',req.user);
  res.status(200).send(req.user);
}


function readHandel(req, res) {
  res.status(200).send('read ! ');
}

function createHandel(req, res) {
  res.status(200).send('created ! ');
}

function updateHandel(req, res) {
  res.status(200).send('updated ! ');
}

function deleteHandel(req, res) {
  res.status(200).send('DELETED ! ');
}
module.exports = router;