'use strict';

const Poi = require('../models/poi');
const Boom = require('@hapi/boom');
const User = require('../models/user');


const Pois = {
  findAll: {
      auth: false,
      handler: async function (request, h) {
          try {
              const pois = await Poi.find().populate('location').find();
              return pois;
          } catch (err) {
              return Boom.badImplementation('error fetching ');
          }
      }
  },
  findByUsersUpdated: {
    auth: false,
    handler: async function(request, h) {
     const pois = await Poi.find({ userUpdated: request.params.id });
     return pois;
  }
 },
  createPoi:{
    auth: false,
    handler: async function(request, h) {
      let poi = new Poi(request.payload);
      const user = await User.findOne({ _id: request.params.id });
      if (!user) {
      return Boom.notFound('No User with this id');
      }
      poi.userUpdated = user._id;
      let poiResponse;
      poiResponse = await poi.save();
      return poiResponse;
    }
  },
  deleteAll: {
    auth: false,
    handler: async function(request, h) {
      await Poi.deleteMany({});
      return { success: true };
    }
  }

};

module.exports = Pois;