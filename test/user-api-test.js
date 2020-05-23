'use strict';
const _ = require('lodash');
const assert = require('chai').assert;
const PoiService = require('./poi-service');
const fixtures = require('./fixtures.json');

suite('Users API tests', function () {

  let users = fixtures.users;
  let newUser = fixtures.newUser;

  const poiService = new PoiService('http://localhost:3000');

  setup(async function () {
    await poiService.deleteAllUsers(); //setup for populating the system
  });

  teardown(async function () {
    await poiService.deleteAllUsers();
  });

  test('create a user', async function () {
    const returnedUser = await poiService.createUser(newUser);
   // assert.equal(returnedUser.firstName, newUser.firstName);
   // assert.equal(returnedUser.lastName, newUser.lastName);
   // assert.equal(returnedUser.email, newUser.email);
   // assert.equal(returnedUser.password, newUser.password);
    assert(_.some([returnedUser], newUser), ' returnedUSer must be a superset of newUser'); //test the new user object is the same as what is expected - rather than checking each field
    assert.isDefined(returnedUser._id);
  });

  test('delete a user', async function () {
    let c = await poiService.createUser(newUser);
    assert(c._id != null);
    await poiService.deleteOneUser(c._id);
    c = await poiService.getUser(c._id);
    assert(c == null);
  });
  test('get a user', async function () {
    const c1 = await poiService.createUser(newUser);
    const c2 = await poiService.getUser(c1._id);
    assert.deepEqual(c1, c2);
  });
  test('get invalid user', async function () {
    const c1 = await poiService.getUser('1234');
    assert.isNull(c1);
    const c2 = await poiService.getUser('012345678901234567890123');
    assert.isNull(c2);
  });
  test('get all users', async function () {
    for (let c of users) {
      await poiService.createUser(c);
    }
    const allUsers = await poiService.getUsers();
    assert.equal(allUsers.length, users.length);
  });
  test('get users detail', async function () {
    for (let c of users) {
      await poiService.createUser(c);
    }
    const allUsers = await poiService.getUsers();
    for (var i = 0; i < users.length; i++) {
      assert(_.some([allUsers[i]], users[i]), 'returnedUsers must be a superset of newUser');
    }
  });

});