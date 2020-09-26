const users = require('../models/users-schema.js');
const superagent = require('superagent');
require('dotenv').config();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

/**
 * 
 * @param {obj} req 
 * @param {obj} res 
 * @param {callBack} next 
 */

module.exports = async (req, res, next)=> {
  // 1 - get the code
  // 2- exchange code with token
  // 3- i have the token, exchange token with user
  // 4- save user to my db
    
  console.log('req.query ---------> ',req.query);
  let code = req.query.code;
  console.log('(1) code : ',code);

  let token = await exchangeCodeWithToken(code);
  console.log('(2) token  -- From exchangeCodeWithToken ---> ',token);
    
  let user = await exchangeTokenWithUser(token);
  console.log('(3) GITHUB USER', user);

  let [savedUser, serverToken] = await saveUser(user);

  req.user = savedUser; 
  req.token = serverToken;
  console.log('(4) LOCAL USER', savedUser);
  next();

};

/**
 * func that exchange Code With Token
 * @param {*} code 
 */

async function exchangeCodeWithToken(code) {
  const urlToGetToken = 'https://github.com/login/oauth/access_token';
  const response = await superagent.post(urlToGetToken).send({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code: code,
    redirect_uri: 'http://localhost:4000/oauth',
  });
  console.log('exchangeCodeWithToken response ----> ',response.body);
  return response.body.access_token;
}

/**
 * func that exchange Token With User
 * @param {*} token 
 */
async function exchangeTokenWithUser(token) {
  let userResponse = await superagent
    .get('https://api.github.com/user')
    .set('Authorization', `token ${token}`)
    .set('User-Agent', 'user-agent/1.0');

  console.log('userResponse.body: ',userResponse.body);
  return userResponse.body;
}

/**
 * fun save User in DB and generate Token from server
 * @param {obj} user 
 */
async function saveUser(user) {
  console.log('user::::::::::::::: ', user);
  try {
    let record = {
      username: user.login,
      password: 'XXXX', /// this password will not be used to signin because github will not provide it (secure)
    };
    let newUser = new users(record);
    let savedUser = await newUser.save();
    //generate token from my server 
    let myserverToken = users.generateToken(savedUser);
    console.log('savedUser', savedUser);
    console.log('myserverToken',myserverToken);
    return [savedUser, myserverToken];

  } catch (e) {
    return Promise.reject();
  }
}

// node .
// http://127.0.0.1:5500/public/index.html   // n browser
// 