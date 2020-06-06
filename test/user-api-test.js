'use strict';
const _ = require('lodash');
const assert = require('chai').assert;
const expect = require('chai').expect;
const PoiService = require('./poi-service');
const fixtures = require('./fixtures.json');
//required imports for Chia deepEqualExcluding
const chai = require('chai');
const chaiExclude = require('chai-exclude');
chai.use(chaiExclude);

suite('Users API tests', function () {

  let users = fixtures.users;
  let newUser = fixtures.newUser;
  let newPoi = fixtures.newPoi;

  const poiService = new PoiService(fixtures.poiService); //pointing to the localhost:3000

  suiteSetup(async function() {
   // await poiService.deleteAllUsers(); had to be removed for JWT setup
    const returnedUserMain = await poiService.createUser(newUser);
   const responseMain = await poiService.authenticate(newUser);
  });


  suiteTeardown(async function() {
    await poiService.deleteAllUsers();
    poiService.clearAuth();
  });

  test('create a user', async function () {
    const returnedUser = await poiService.createUser(newUser);
    const responseMain = await poiService.authenticate(newUser);
    assert.equal(returnedUser.firstName, newUser.firstName);
    assert.equal(returnedUser.lastName, newUser.lastName);
    assert.equal(returnedUser.email, newUser.email);
    //couldn't complete a test for the hash functionality
    //TODO complete functionality on this.
    //initially worked until the hash was introduced
    // assert(_.some([returnedUser], newUser), ' returnedUSer must be a superset of newUser'); //test the new user object is the same as what is expected - rather than checking each field
    expect([returnedUser.firstName,returnedUser.lastName,returnedUser.email,
           returnedUser.level]).to.have.members([newUser.firstName,newUser.lastName,
            newUser.email,newUser.level]);
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
    const returnedUserMain = await poiService.createUser(newUser);
    const responseMain = await poiService.authenticate(newUser);
    await poiService.deleteAllUsers();
    for (let c of users) {
      await poiService.createUser(c);
      await poiService.authenticate(c);
    }
    console.log("All users")
    const allUsers = await poiService.getUsers();

    console.log(allUsers)
    assert.equal(allUsers.length, users.length);
  });
  test('get users detail', async function () {
    const returnedUserMain = await poiService.createUser(newUser);
    const responseMain = await poiService.authenticate(newUser);
    await poiService.deleteAllUsers();
    for (let c of users) {
        await poiService.createUser(c);
        await poiService.authenticate(c);
    }
    const allUsers = await poiService.getUsers();
    for (var i = 0; i < users.length; i++) {
      //https://www.chaijs.com/plugins/chai-exclude/
      //assert(_.some([allUsers[i]], users[i]), 'returnedUsers must be a superset of newUser');
      //had to introduce npm install chai-exclude --save-dev
      //see also the imports above
      assert.deepEqualExcluding(allUsers[i],users[i],['password', '__v','_id'],
        'deep Equal excluding __v and _id and password');

    }
  });

});