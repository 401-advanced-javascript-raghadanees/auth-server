'use strict';

const jwt = require('jsonwebtoken');
const { server } = require('../src/server.js');// {server} >>>destructuring 
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(server);

describe(' Auth .........', () => {

  it('can list() allusers ______________ ', async () => {
    let user1 = { username: 'Raghad', password: '1234' };
    let user2 = { username: 'Roro', password: '1234' };
    let user3 = { username: 'Rere', password: '1234' };
    let List = [user1, user2, user3];
    await mockRequest.post('/users').send(user1);
    await mockRequest.post('/users').send(user2);
    await mockRequest.post('/users').send(user3);
    let allUsers = await mockRequest.get('/users');
    let user = allUsers.body.results;
    user.forEach((key) => {
      expect(user[key]).toEqual(List[key]);
    });
  });


  it('can sign up...............', async () => {
    let userInfo = { username: 'Raghad', password: '1234' };
    let output = await mockRequest.post('/signup').send(userInfo);
    let user = output.body;
    expect(userInfo[name]).toEqual(user[name]);
  });

  it('can signin basicAuth >>>>>>>>>>>> ', async () => {
    let userInfo = { username: 'Raghad', password: '1234' };
    await mockRequest.post('/signup').send(userInfo);
    let output = await mockRequest.post('/signin').auth('Raghad', '1234');
    let token = jwt.verify(output.body.token, process.env.SECRET);
    expect(token).toBeDefined();
  });


  it('respond 500 ??????????????? ', () => {
    return mockRequest.get('/bad').then(result => {
      expect(result.status).toBe(500);
    }).catch(err => {
      console.log(err);
    });
  });

  it(' respond with 404 ---------------------', () => {
    return mockRequest.get('/users/notFound').then(result => {
      expect(result.status).toBe(404);
    }).catch(err => {
      console.log(err);
    });
  });


});