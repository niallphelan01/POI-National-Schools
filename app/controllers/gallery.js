'use strict';


const User = require('../models/user');
const Poi = require('../models/poi');
const ImageStore = require('../utils/image-store');
var localStorage = require('localStorage')

const Gallery = {
  index: {
    handler: async function(request, h) {
      try {
        const allImages = await ImageStore.getAllImages();
        return h.view('gallery', {
          title: 'Cloudinary Gallery',
          images: allImages
        });
      } catch (err) {
        console.log(err);
      }
    }
  },

  uploadFile: {

    handler: async function(request, h) {
      try {
        const file = request.payload.imagefile; //filename
        const poiId = request.params.id;        //poiId to reference
        var userid = request.auth.credentials.id;  //user uploading to reference
        var user = await User.findById(userid).lean();
        if (Object.keys(file).length > 0) {
          const result = await ImageStore.uploadImage(file, poiId, user);
          return h.redirect('/adminHome');
        }
      } catch (err) {
        console.log(err);
      }
    },
    payload: {
      multipart: true,
      output: 'data',
      maxBytes: 209715200,
      parse: true
    }
  },

  deleteImage: {
    handler: async function(request, h) {
      try {
        await ImageStore.deleteImage(request.params.id);
      } catch (err) {
        console.log(err);
      }
      try {
        let poiId = localStorage.getItem('poiSelectedToShowImages');
        //local storage used to save retain the poi id for the selected cloudinary id so as to be able to delete from the field in the relevant document
        delete localStorage.test; //clear the local storage
        var poiData = await Poi.findById(poiId);
        await poiData.updateOne({
          cloudinary_public_id: null,
          cloudinary_secure_url: null
        });
        return h.redirect('/updatePoi/'+poiId);
      }
      catch (err){
        console.log(err);
        return h.redirect('/adminHome');
      }
    }
  }
};

module.exports = Gallery;
