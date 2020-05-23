'use strict';

const assert = require('chai').assert;
const axios = require('axios');

suite('User API tests', function () {


  test('get users', async function () {
    const response = await axios.get('http://localhost:3000/api/users');
    const users = response.data;
    assert.equal(3, users.length);

    assert.equal(users[0].firstName, 'basic');
    assert.equal(users[0].lastName, 'test');
    assert.equal(users[0].email, 'basic@test.com');
    assert.equal(users[0].level, 'basic');

    assert.equal(users[1].firstName, 'admin');
    assert.equal(users[1].lastName, 'test');
    assert.equal(users[1].email, 'admin@test.com');
    assert.equal(users[1].level, 'admin');

    assert.equal(users[2].firstName, 'superadmin');
    assert.equal(users[2].lastName, 'test');
    assert.equal(users[2].email, 'superadmin@test.com');
    assert.equal(users[2].level, 'superAdmin');
  });
  test('get one user', async function () {
    let response = await axios.get('http://localhost:3000/api/users');
    const users = response.data;
    assert.equal(3, users.length);

    const oneUserUrl = 'http://localhost:3000/api/users/' + users[0]._id;
    response = await axios.get(oneUserUrl);
    const oneUser = response.data;

    assert.equal(oneUser.firstName, 'basic');
    assert.equal(oneUser.lastName, 'test');
    assert.equal(oneUser.email, 'basic@test.com');

  });

  test('create a user', async function () {
    const usersUrl = 'http://localhost:3000/api/users';
    const newUser = {
      firstName: 'Barnie',
      lastName: 'Grumble',
      email: 'bgrumble@test.com',
      password: 'test'
    };

    const response = await axios.post(usersUrl, newUser);
    const returnedUser = response.data;
    assert.equal(201, response.status);

    assert.equal(returnedUser.firstName, 'Barnie');
    assert.equal(returnedUser.lastName, 'Grumble');
    assert.equal(returnedUser.email, 'bgrumble@test.com');
    assert.equal(returnedUser.password, 'test');
  });

  test('delete a user', async function() {
    let response = await axios.get('http://localhost:3000/api/users');
    let users = response.data;
    const originalSize = users.length;

    const oneUserUrl = 'http://localhost:3000/api/users/' + users[0]._id;
    response = await axios.get(oneUserUrl);
    const oneUser = response.data;
    assert.equal(oneUser.firstName, 'basic');

    response = await axios.delete('http://localhost:3000/api/users/' + users[0]._id);
    assert.equal(response.data.success, true);

    response = await axios.get('http://localhost:3000/api/users');
    users = response.data;
    assert.equal(users.length, originalSize - 1);
  });
  test('delete all users', async function() {
    let response = await axios.get('http://localhost:3000/api/users');
    let users = response.data;
    const originalSize = users.length;
    assert(originalSize > 0);
    response = await axios.delete('http://localhost:3000/api/users');
    response = await axios.get('http://localhost:3000/api/users');
    users = response.data;
    assert.equal(users.length, 0);
  });
 


});