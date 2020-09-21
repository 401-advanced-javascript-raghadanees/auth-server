'use strict';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.SECRET || 'Raghad';


class Model {
  constructor(schema) {
    this.schema = schema;
  }

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
    return Promise.reject(' user is exist');
  }

  async authenticate(user, pass) {
    // Signin
    // headers Basic : username and password
    // compare the password with the DB hashed password
    //return the user object

    let userInDb = await this.schema.find({ username: user });
    console.log('userInDb inside authentication :', userInDb);

    let valid = await bcrypt.compare(pass, userInDb[0].password);
    console.log('valid ?? :', valid);
    returnValue = valid ? userInDb : Promise.reject('wrong password !!');
    return returnValue;
  }

  async list(){
    
    let allUsers = await this.schema.find({ });
    // console.log('inside list',allUsers);

    return allUsers;
  }


  async  generateToken(user){
    let token = await jwt.sign({ username: user.username }, SECRET);
    return token;
  }
  
}

module.exports = Model;

