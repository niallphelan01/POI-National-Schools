'use strict';
const _ = require('lodash');
const assert = require('chai').assert;
const PoiService = require('./poi-service');
const fixtures = require('./fixtures.json');

suite('Users API tests', function () {

    let users = fixtures.users;
    let locations = fixtures.Location;
    let newLocation = fixtures.newLocation;
    let newUser = fixtures.newUser;

    const poiService = new PoiService(fixtures.poiService); //pointing to the localhost:3000

    suiteSetup(async function () {
       await poiService.deleteAlllocations();
        const returnedUser = await poiService.createUser(newUser);
        const response = await poiService.authenticate(newUser);
    });

    test('get all locations', async function () {
       await poiService.deleteAlllocations();
        for (let c of locations) {
            await poiService.createLocation(c);
        }
        const allLocations = await poiService.getAlllocations();
        assert.equal(allLocations.length, locations.length);
    });
    test('create a location', async function() {
        await poiService.deleteAlllocations();
        await poiService.createLocation(newLocation);
        const returnedLocation = await poiService.getAlllocations();
        console.log(returnedLocation[0]);
        console.log(newLocation)
        assert.equal(returnedLocation.length, 1);
        //assert.deepEqual(returnedLocation[0], newLocation); //check for the same object created
        assert(_.some([returnedLocation[0]], newLocation),'returned location must be a superset of location')
    });

    //TODO add location testing

})