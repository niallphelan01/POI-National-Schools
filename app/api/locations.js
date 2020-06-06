'use strict';

const Location = require('../models/location');
const Boom = require('@hapi/boom');


const Locations = {
  findAll: {
    auth: {strategy: 'jwt'},
    handler: async function(request, h) {
      const location = await Location.find();
      return location;
    }
  },
  deleteAll: {
    auth: {strategy: 'jwt'},
    handler: async function(request, h) {
     const location =  await Location.deleteMany({});
      return { success: true };
    }
  },
createLocation:{
  auth: {strategy: 'jwt'},
      handler: async function(request, h) {
    let location = new Location(request.payload);
    let locationResponse
    locationResponse = await location.save();
    return locationResponse;
  }
},}


module.exports = Locations;