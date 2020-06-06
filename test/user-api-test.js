'use strict';
const _ = require('lodash');
const assert = require('chai').assert;
const PoiService = require('./poi-service');
const fixtures = require('./fixtures.json');

suite('Users API tests', function () {

  let users = fixtures.users;
  let newUser = fixtures.newUser;
  let newPoi = fixtures.newPoi;

  const poiService = new PoiService(fixtures.poiService); //pointing to the localhost:3000

  suiteSetup(async function() {
    await poiService.deleteAllUsers();
    //const returnedUser = await poiService.createUser(newUser);
    //const response = await poiService.authenticate(newUser);
  });

  /*setup(async function () {
    await poiService.deleteAllUsers(); //setup for populating the system
    await poiService.deleteAllPois();
  });
   */
  suiteTeardown(async function() {
    await poiService.deleteAllUsers();
    poiService.clearAuth();
  });
  /*
  teardown(async function () {
    await poiService.deleteAllUsers();
    await poiService.deleteAllPois();
  });
*/
  test('create a user', async function () {
    const returnedUser = await poiService.createUser(newUser);
    assert.equal(returnedUser.firstName, newUser.firstName);
    assert.equal(returnedUser.lastName, newUser.lastName);
    assert.equal(returnedUser.email, newUser.email);
    assert.equal(returnedUser.password, newUser.password);
    assert(_.some([returnedUser], newUser), ' returnedUSer must be a superset of newUser'); //test the new user object is the same as what is expected - rather than checking each field
    assert.isDefined(returnedUser._id);
  });
  test('create a poi', async function() {
      const returnedUser = await poiService.createUser(newUser);
      await poiService.createPoi(returnedUser._id, newPoi);
      const returnedPois = await poiService.getPois(returnedUser._id);


    console.log(returnedPois);
    assert.equal(returnedPois.length, 1);
    //TODO fix this

    //assert(_.some([returnedPois[0]], newPoi), 'returned poi must be a superset of poi');
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
    await poiService.deleteAllUsers();
    for (let c of users) {
      await poiService.createUser(c);
    }
    console.log("All users")
    const allUsers = await poiService.getUsers();

    console.log(allUsers)
    assert.equal(allUsers.length, users.length);
  });
  test('get users detail', async function () {
    await poiService.deleteAllUsers();
    for (let c of users) {
        await poiService.createUser(c);
    }
    const allUsers = await poiService.getUsers();
    for (var i = 0; i < users.length; i++) {
      assert(_.some([allUsers[i]], users[i]), 'returnedUsers must be a superset of newUser');
    }
  });

});