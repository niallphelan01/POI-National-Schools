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
  }
}

module.exports = Locations;