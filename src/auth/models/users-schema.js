'use strict';
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.SECRET || 'Raghad';

const userSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String },
  role: { type: String, enum: ['admin', 'editor', 'writer', 'user'] },
});

let roles = {
  admin: ['read', 'create', 'update', 'delete'],
  editor: ['read', 'create', 'update'],
  writer: ['read', 'create'],
  user: ['read'],
};

userSchema.pre('save', async function() {
  this.password = await bcrypt.hash(this.password, 5); /// hashing password then save in db
});

// user.methods >>>> adding methods to the schema 
userSchema.methods.comparePasswords = async function (password) {
  const valid = await bcrypt.compare(password, this.password); 
  return valid ? this : null;
};

userSchema.statics.generateToken = function (username) {
  return jwt.sign({ username: username }, SECRET);
};


userSchema.statics.authenticate = async function (username, password) {
  let userInDb = await this.findOne({ username: username });
  if (userInDb) {
    let result = await userInDb.comparePasswords(password);
    return result;
  } else {
    return null;
  }
};

userSchema.statics.authenticateToken = async function (token) {
  
  try {
    let tokenObject = jwt.verify(token, SECRET); // return an object after decoding the token
    console.log('tokenObject -----> ', tokenObject); 

    let tokenDB = await this.findOne({ username: tokenObject.username }); 
    console.log('tokenDB ---------<<< ', tokenDB); 

    if (tokenDB) {
      return Promise.resolve({
        tokenObject: tokenObject,
        user: tokenObject.username,
      });
    } else {
      return Promise.reject();
    }

  } catch (e) {
    return Promise.reject();
  }
};

module.exports = mongoose.model('user', userSchema);