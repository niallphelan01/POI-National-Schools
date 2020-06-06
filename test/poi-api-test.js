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

    const poiService = new PoiService(fixtures.poiService); //pointing to the localhost:3000

    suiteSetup(async function () {
        await poiService.deleteAllPois();
        const returnedUser = await poiService.createUser(newUser);
        const response = await poiService.authenticate(newUser);
    });


    suiteTeardown(async function () {
        await poiService.deleteAllUsers();
        poiService.clearAuth();
    });

    test('create a poi', async function() {
        const returnedUser = await poiService.createUser(newUser);
        await poiService.createPoi(returnedUser._id, newPoi);
        const returnedPois = await poiService.getPois(returnedUser._id);


        console.log(returnedPois);
        assert.equal(returnedPois.length, 1);
        //TODO fix this
       // assert(_.some([returnedPois[0]], newPoi), 'returned poi must be a superset of poi');
    });

        test('get all pois', async function () {
            await poiService.deleteAllPois();
            const returnedUser = await poiService.createUser(newUser);
            for (let c of pois) {
                await poiService.createPoi(returnedUser._id,c);
            }
            const allPois = await poiService.getAllPois();
            assert.equal(allPois.length, pois.length);
        });
    test('delete a poi', async function () {
        const returnedUser = await poiService.createUser(newUser);
        await poiService.deleteAllPois();
        let c = await poiService.createPoi(returnedUser._id,newPoi);
        assert(c._id != null);
        await poiService.deleteOnePoi(c._id);
        c = await poiService.getPoisbyId(c._id);
        assert(c === null);
    });
})