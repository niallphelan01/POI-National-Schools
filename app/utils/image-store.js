'use strict';
const Poi = require('../models/poi');
const cloudinary = require('cloudinary');
const fs = require('fs');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);

const ImageStore = {
  configure: function() {
    const credentials = {
      cloud_name: process.env.cloudinary_name,
      api_key: process.env.cloudinary_key,
      api_secret: process.env.cloudinary_secret_key
    };
    cloudinary.config(credentials);
  },

  getAllImagesbyPOi: async function(id) {
    const result = await cloudinary.v2.api.resources_by_ids([id]); //only returns a cloudinary object(s) for tge public ids selected
    return result.resources;
  },

  uploadImage: async function(imagefile, poiId, userObj) {
    let resultFromFunction = {};
    const poiToUpdate = await Poi.findById(poiId);
    var currentDate = new Date();
    var date = currentDate.getDate();
    var month = currentDate.getMonth(); //Be careful! January is 0 not 1
    var year = currentDate.getFullYear();
    var dateString = date + "-" +(month + 1) + "-" + year;

    await writeFile('./public/temp.jpg', imagefile);
    await cloudinary.uploader.upload('./public/temp.jpg', function (result){

      resultFromFunction = result;
    });
    //if(typeof poiToUpdate.cloudinary_public_id==='undefined') //check to see if the field userUpdated has been entered into the db
    //{
      console.log("sending user updating and date uploaded to the database");
      console.log(resultFromFunction)
      await poiToUpdate.updateOne({
        cloudinary_public_id: resultFromFunction.public_id,
        cloudinary_secure_url: resultFromFunction.secure_url,
        userUpdated:userObj,
        dateUpdated:dateString
      });
    //}

  },


  deleteImage: async function(id) {
    //delete the image selected
    await cloudinary.v2.uploader.destroy(id, function(error,result) {
      console.log(result, error) });

  },


};

module.exports = ImageStore;