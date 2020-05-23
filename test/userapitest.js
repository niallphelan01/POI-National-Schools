'use strict';

const assert = require('chai').assert;
const axios = require('axios');

suite('User API tests', function () {


  test('get users', async function () {
    const response = await axios.get('http://localhost:3000/api/users');
    const users = response.data;
    assert.equal(6, users.length);

    assert.equal(users[0].firstName, 'test');
    assert.equal(users[0].lastName, 'test');
    assert.equal(users[0].email, 'test21@test.com');
    assert.equal(users[0].level, 'basic');
  });
  test('get one user', async function () {
    let response = await axios.get('http://localhost:3000/api/users');
    const users = response.data;
    assert.equal(6, users.length);

    const oneUserUrl = 'http://localhost:3000/api/users/' + users[0]._id;
    response = await axios.get(oneUserUrl);
    const oneUser = response.data;

    assert.equal(oneUser.firstName, 'test');
    assert.equal(oneUser.lastName, 'test');
    assert.equal(oneUser.email, 'test21@test.com');
  });

});