'use strict';

const Poi = require('../models/poi');
const Boom = require('@hapi/boom');

const Pois = {
  findAll: {
    auth: false,
    handler: async function (request, h) {
      const pois = await Poi.find();
      return pois;
    }
  },
  findByUsersUpdated: {
    auth: false,
    handler: async function(request, h) {
     const pois = await Poi.find({ userUpdated: request.params.id });
     return pois;
  }
}
};

module.exports = Pois;