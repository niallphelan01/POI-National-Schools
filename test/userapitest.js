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

});