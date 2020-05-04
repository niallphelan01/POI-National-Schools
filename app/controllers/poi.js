'use strict';

const User = require('../models/user');
const Poi = require('../models/poi');
const ImageStore = require('../utils/image-store');
var localStorage = require('localStorage')
const os = require("os");
const Boom = require('@hapi/boom');
var Fs = require('fs');

const Pois = {

  home: {
    handler: async function(request, h) {
      const pois = await Poi.find().populate().lean();
      const use = await User.find().populate().lean();
      //let county = "Carlow";
      // let user = await Poi.findByCounty(county); not used
        let hostname =os.hostname;
        return h.view('home', {
        title: 'Poi information page',
        pois: pois,
        os: hostname
      });
    }
  },
  deletePoi: {
    handler: async function(request, h) {
      const id = request.params.id;
      const poiToDelete = await Poi.findById(id);

      var userid = request.auth.credentials.id;
      var user = await User.findById(userid).lean();
      if (user.level === "basic") {
        const message = "You have insufficient rights, please contact the superAdmin to get sufficient rights"
        return h.view('home', {
          title: 'Poi data',
          user: user,
          errors: [{ message: message }]
        });
      } else if (user.level === "admin") {
        await poiToDelete.delete();
        return h.redirect('/adminHome');
      }
      ;
    }
  },
  showDetails: {
    handler: async function(request, h) {
      //handle whether the user is a admin or not
      const id = request.params.id;
      var userid = request.auth.credentials.id;
      const pois = await Poi.find().populate().lean();
      var user = await User.findById(userid).lean(); //find the user to check for adequate level
      const poi = await Poi.findById(id).lean();
      localStorage.setItem('poiSelectedToShowImages', id); //use this as part of the deletion to images
      const poiImages = await ImageStore.getAllImagesbyPOi(poi.cloudinary_public_id); //get the details of the cloudinary image to show
      console.log(poiImages);
      if (user.level === "basic") {
        const message = "You have insufficient rights, please contact the superAdmin to get sufficient rights"
        const pois = await Poi.find().populate().lean();
        return h.view('home', {
          title: 'Poi data',
          user: user,
          errors: [{ message: message }],
          pois: pois
        });
      } else if (user.level === "admin") {
        return h.view('poiUpdate', {
          title: 'Update National school data',
          user: user,
          poi: poi,
          images: poiImages
        });
      }
    }
  },
  updateDetails: {
    handler: async function(request, h) {
      var currentDate = new Date();
      var date = currentDate.getDate();
      var month = currentDate.getMonth(); //Be careful! January is 0 not 1
      var year = currentDate.getFullYear();
      var dateString = date + "-" + (month + 1) + "-" + year;
      const poi = request.payload;
      const id = request.auth.credentials.id;
      var user = await User.findById(id);
      var poiData = await Poi.findById(poi.id);
      if (typeof poiData.userUpdated === 'undefined') //check to see if the field userUpdated has been entered into the db
      {
        console.log("sending user updating and date uploaded to the database");
        await poiData.updateOne({
          userUpdated: user.id,
          dateUpdated: dateString,
          Region: poi.Region,
        });
      }


      //update the database fields from the form entry
      poiData.Roll_No = poi.Roll_No;
      poiData.Off_Name = poi.Off_Name;
      poiData.County = poi.County;
      poiData.Add_1 = poi.Add_1;
      poiData.Add_2 = poi.Add_2;
      poiData.Add_3 = poi.Add_3;
      poiData.Ethos = poi.Ethos;
      poiData.Island = poi.Island;
      poiData.DEIS = poi.Deis;
      poiData.Gaeltacht = poi.Gaeltacht;
      poiData.M_13_14 = parseInt(poi.Boy1314);
      poiData.F_13_14 = parseInt(poi.Girl1314);
      poiData.T_13_14 = parseFloat(poiData.M_13_14 + poiData.F_13_14,); //this forces the addition not concatenation of the addition
      //we don't save the total directly incase of incorrect entry
      poiData.xcoord = poi.xcoord;
      poiData.ycoord = poi.ycoord;
      poiData.Long = poi.long;
      poiData.Lat = poi.lat;
      poiData.userUpdated = user.id;
      poiData.dateUpdated = dateString;
      poiData.Region = poi.Region;

      await poiData.save();


      if (user.level === "basic") {
        return h.redirect('/home');
      } else if (user.level === "admin") {
        return h.redirect('/adminHome');
      }


    }
  },

  newPoi: {
    handler: async function(request, h) {
      var currentDate = new Date();
      var date = currentDate.getDate();
      var month = currentDate.getMonth(); //Be careful! January is 0 not 1
      var year = currentDate.getFullYear();
      var dateString = date + "-" + (month + 1) + "-" + year;
      const poi = request.payload;
      const id = request.auth.credentials.id;
      var user = await User.findById(id);

      const newPoi = new Poi({
        Roll_No: poi.Roll_No,
        Off_Name: poi.Off_Name,
        County: poi.County,
        Add_1: poi.Add_1,
        Add_2: poi.Add_2,
        Add_3: poi.Add_3,
        Ethos: poi.Ethos,
        Island: poi.Island,
        DEIS: poi.DEIS,
        Gaeltacht: poi.Gaeltacht,
        M_13_14: parseInt(poi.Boy1314),
        F_13_14: parseInt(poi.Girl1314),
        T_13_14: parseFloat(poi.Boy1314 + poi.Girl1314,), //this forces the addition not concatenation of the addition
        //we don't save the total directly incase of incorrect entry
        xcoord: poi.xcoord,
        ycoord: poi.ycoord,
        Long: poi.Long,
        Lat: poi.Lat,
        userUpdated: user.id,
        dateUpdated: dateString,
        Region: poi.Region,

      });
      await newPoi.save();
      return h.redirect('/home');
    }

  },

  poiRegionSelect: {
    handler: async function(request, h) {
      const id = request.params.id;
      var poi = {};
      if (id === 'all')
         {
          poi = await Poi.find().populate().lean(); //if all category is selected
         }
      else
        {
          poi = await Poi.findByRegion(id).lean(); //category by region

        }
      var userid = request.auth.credentials.id;
      var user = await User.findById(userid).lean();

      //user is taken to a different homepage depending on level
      if (user.level === "basic") {
        return h.view('home', {
          title: 'Poi information page',
          pois: poi
        });
      }
      else{
        return h.view('adminHome', {
          title: 'Poi information page',
          pois: poi
        });
      }
    }
  },

  showPoi: {
    handler: async function(request, h) {
      const pois = await Poi.find().populate().lean();
      var userid = request.auth.credentials.id;
      var user = await User.findById(userid).lean(); //find the user to check for adequate level
      if (user.level === "basic") {
        const message = "You have insufficient rights, please contact the superAdmin to get sufficient rights"
        return h.view('home', {
          title: 'Poi data',
          user: user,
          errors: [{ message: message }],
          pois: pois
        });
      } else if (user.level === "admin") {
        return h.view('newPoi', { user: user, title: 'Add National school data' });
      }
    },
  },
  singlePoiDisplay:{
    handler: async function(request,h){
      const id = request.params.id;
      const poiToShow = await Poi.findById(id).lean();
      return h.view('singlePoiDisplay', {
        title: 'Single National School Display',
        poi: poiToShow
      });
    }
  }

  /*,
  uploadImage:{
    handler: async function(request, h) {
      return h.view('uploadImage');
    }
  },
  uploadImageRequest:{
    payload: {
      output: 'stream',
      allow: ['application/json', 'image/*', 'multipart/form-data','application/pdf', 'application/x-www-form-urlencoded'],
      multipart: true, //this has to be added to accept multipart data https://hapi.dev/api/?v=19.1.1#-routeoptionspayloadmultipart
    },
    handler: async function(request, h) {

      try {
        console.log(request.payload);
        const response = handleFileUpload(request.payload.image)
        return response;
        return h.view('uploadImage');
      }

      catch (err) {
        // error handling
        console.log(Boom.badRequest(err));

      }
    }
  }


    }


const handleFileUpload = file => {
  return new Promise((resolve, reject) => {
    const filename = file.hapi.filename
    const data = file._data
    Fs.writeFile('./uploads/' + filename, data, err => {
      if (err) {
        reject(err)
      }
      //resolve({ message: 'Upload successfully!' })

      cloudinary.uploader.upload('./uploads/angry.jpg', { tags: 'basic_sample' }, function (err, image) {
        console.log();
        console.log("** File Upload");
        if (err) { console.warn(err); }
        console.log("* public_id for the uploaded image is generated by Cloudinary's service.");
        console.log("* " + image.public_id);
        console.log("* " + image.url);

      });



    })
  })
}
*/
}
module.exports = Pois;
