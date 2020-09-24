'use strict';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.SECRET || 'Raghad';


class Model {
  constructor(schema) {
    this.schema = schema;
  }

  /**
 * 
 * @param {object} record 
 */

  async create(record) {

    console.log('recorde', record);
    let addedUserName = await this.schema.find({ username: record.username });
    await console.log('searching user .... ', addedUserName);


    if (addedUserName.length === 0) {  //no such username in db so hash the pass and save 
      record.password = await bcrypt.hash(record.password, 5);

      let newRecord = new this.schema(record);
      console.log('hashed record >>>>> ', newRecord);
      return await newRecord.save();
    }
    return ' user is exist';
  }

  async authenticate(user, pass) {
    // Signin
    // headers Basic : username and password
    // compare the password with the DB hashed password
    //return the user object

    let userInDb = await this.schema.findOne({ username: user });
    // console.log('userInDb inside authentication :', userInDb);
    // console.log('userInDb',userInDb)
    let valid = await bcrypt.compare(pass, userInDb.password);
    // console.log('userInDb.password',userInDb.password )
    
    // console.log('valid ?? :', valid);

    let returnValue = valid ? userInDb : 'wrong password !!';
    console.log('returnValue', returnValue);
    return returnValue;
  }

  async list(){
    
    let allUsers = await this.schema.find();
    console.log('inside list',allUsers);

    return allUsers;
  }

  /**
 * 
 * @param {object} user 
 */
  generateToken(user){
    let token =  jwt.sign({ username: user.username }, SECRET);
    return token;
  }

  /**
 * To authenticate Token
 * @param {*} token 
 */

  async authenticateToken(token) {
    try {
      let tokenObject = jwt.verify(token, SECRET);
      console.log('token..........', token);
      console.log('tokenObject----->', tokenObject);

      let tokenDB = await this.schema.find({ username: tokenObject.username });

      console.log('tokenDB -----> ', tokenDB);
     


      if (tokenDB) {
        return Promise.resolve({ 
          tokenObject: tokenObject,
          user: tokenObject.username,
        });

      } else {
        return Promise.reject();
      }

    } catch (e) {
      // console.log('catch reject .......');
      return Promise.reject();
    }

  }

  
}

module.exports = Model;

