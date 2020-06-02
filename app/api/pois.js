'use strict';

const Poi = require('../models/poi');
const Location = require('../models/location')
const Boom = require('@hapi/boom');
const User = require('../models/user');


const Pois = {
  findAll: {
      auth: false,
      handler: async function (request, h) {
          try {
              const pois = await Poi.find().populate('location').find();
              //pois.type('application/xml');
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
  },
    deleteOne: {
        auth: false,
        handler: async function(request, h) {
            await Poi.deleteOne({_id: request.params.id });
            return { success: true };
        }
    },
    updateOne:{
      auth:false,
        handler: async function(request, h) {
           // let poiId = request.params;
            var poiData = await Poi.findById(request.params.id);
            console.log("Poi object")
            console.log(poiData);
            const newPoi = request.payload;
            console.log("New Poi object")
            console.log(newPoi);
            poiData.AIRO_ID = newPoi.AIRO_ID;
            poiData.Roll_No = newPoi.Roll_No;
            poiData.Off_Name = newPoi.Off_Name;
            poiData.County = newPoi.County;
            poiData.Add_1 = newPoi.Add_1;
            poiData.Add_2 = newPoi.Add_2;
            poiData.Add_3 = newPoi.Add_3;
            poiData.Add_4 = newPoi.Add_4;
            poiData.Ethos = newPoi.Ethos;
            poiData.Island = newPoi.Island;
            poiData.DEIS = newPoi.DEIS;
            poiData.Gaeltacht = newPoi.Gaeltacht;
            poiData.M_13_14 = newPoi.M_13_14;
            poiData.F_13_14 = newPoi.F_13_14;
            poiData.T_13_14 = newPoi.T_13_14;
            poiData.xcoord = newPoi.xcoord;
            poiData.ycoord = newPoi.ycoord;
           // poiData.location = newPoi.location;
            poiData.userUpdated = newPoi.userUpdated;
            poiData.dateUpdated =newPoi.dateUpdated;
            poiData.Region = newPoi.Region;
            poiData.cloudinary_public_id = newPoi.cloudinary_public_id;
            poiData.cloudinary_secure_url = newPoi.cloudinary_secure_url;




           try{
               let poiResponse = await poiData.save();
               return poiResponse;
           }
           catch(err){
               console.log(err)
           }

        }
    }

};

module.exports = Pois;