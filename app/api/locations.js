'use strict';

const Location = require('../models/location');
const Boom = require('@hapi/boom');


const Locations = {
  findAll: {
    auth: false,
    handler: async function(request, h) {
      const location = await Location.find();
      return location;
    }
  },
  deleteAll: {
    auth: false,
    handler: async function(request, h) {
     const location =  await Location.deleteMany({});
      return { success: true };
    }
  },
createLocation:{
  auth: false,
      handler: async function(request, h) {
    let location = new Location(request.payload);
    let locationResponse
    locationResponse = await location.save();
    return locationResponse;
  }
},}


module.exports = Locations;