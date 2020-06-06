'use strict';
const _ = require('lodash');
const assert = require('chai').assert;
const expect = require('chai').expect;
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
        console.log(newPoi);
        assert.equal(returnedPois.length, 1);
        //TODO fix this
        expect([returnedPois[0].AIRO_ID,returnedPois[0].Roll_No,returnedPois[0].Off_Name,returnedPois[0].Add_1
                ,returnedPois[0].Add_2, returnedPois[0].Add_3,returnedPois[0].Add_4,returnedPois[0].County, returnedPois[0].Ethos
                ,returnedPois[0].Island,returnedPois[0].DEIS, returnedPois[0].Gaeltacht, returnedPois[0].M_13_14
                ,returnedPois[0].F_13_14,returnedPois[0].T_13_14,returnedPois[0].location,returnedPois[0].xcoord,returnedPois[0].ycoord
                ,returnedPois[0].Region]).to.have.members([newPoi.Roll_No, newPoi.AIRO_ID, newPoi.Off_Name,newPoi.Add_1
                ,newPoi.Add_2, newPoi.Add_3,newPoi.Add_4,newPoi.County, newPoi.Ethos
                ,newPoi.Island,newPoi.DEIS, newPoi.Gaeltacht, newPoi.M_13_14
                ,newPoi.F_13_14,newPoi.T_13_14,newPoi.location,newPoi.xcoord,newPoi.ycoord
                ,newPoi.Region]);

        //check of unordered deep equality
       // https://medium.com/building-ibotta/testing-arrays-and-objects-with-chai-js-4b372310fe6d

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
        assert(c == null);
    });
    test('delete all pois', async function () {
        const returnedUser = await poiService.createUser(newUser); //create a user in the db as this is required for to create a poi
        await poiService.deleteAllPois(); //delete all existing pois
        //Create all pois
        for (let c of pois) {
            await poiService.createPoi(returnedUser._id,c);
        }
        const allPois = await poiService.getAllPois() //get a list of the current pois

        console.log(allPois)
        assert.equal(allPois.length, pois.length);

        //then delete all pois and check to see if value is null
        await poiService.deleteAllPois();
        let c = await poiService.getAllPois();
        assert(c.length == 0); //check to see that there are now pois in the database
    });
    test('find by user updated pois', async function () {
        await poiService.deleteAllPois();
        const returnedUser = await poiService.createUser(newUser);
        let c1 = await poiService.createPoi(returnedUser._id,newPoi);

        const c2 = await poiService.getPois(returnedUser._id);
        const c3 = c2[0] //c2 delivers back an array so just changing to object only to test against creation
        assert.deepEqual(c1, c3);
      //  assert.equal(findByUser.length =1);
    });
    test('find by poi id', async function () {
        await poiService.deleteAllPois();
        const returnedUser = await poiService.createUser(newUser);
        let c1 = await poiService.createPoi(returnedUser._id,newPoi);

        const c2 = await poiService.getPoisbyId(c1._id);
        assert.deepEqual(c1, c2);
        //  assert.equal(findByUser.length =1);
    });
    test('get invalid poi by Id', async function () {
        const c1 = await poiService.getPoisbyId('1234');
        assert.isNull(c1);
        const c2 = await poiService.getPoisbyId('012345678901234567890123');
        assert.isNull(c2);
    });
    test('Invalid poi creation, 3 different options',async function () {
        const returnedUser = await poiService.createUser(newUser);
        const c1 = await poiService.createPoi(returnedUser._id,invalidPoi); //valid user but invalid poi
        assert.isNull(c1);
        const c2 = await poiService.createPoi('122122121','1212112') //invalid user and poi
        assert.isNull(c2);
        const c3 = await poiService.createPoi('122122121',newPoi) //invalid user and valid poi
        assert.isNull(c3);
    })


})