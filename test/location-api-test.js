'use strict';
const _ = require('lodash');
const assert = require('chai').assert;
const PoiService = require('./poi-service');
const fixtures = require('./fixtures.json');

suite('Users API tests', function () {

    let users = fixtures.users;
    let newUser = fixtures.newUser;
    let newPoi = fixtures.newPoi;
    let pois = fixtures.pois;
    let invalidPoi = fixtures.invalidPoi

    const poiService = new PoiService(fixtures.poiService); //pointing to the localhost:3000

    suiteSetup(async function () {
        await poiService.deleteAllLocations();
        const returnedUser = await poiService.createUser(newUser);
        const response = await poiService.authenticate(newUser);
    });


    //TODO add location testing

})