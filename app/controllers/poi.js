'use strict';

const User = require('../models/user');
const Poi = require('../models/poi');

const Pois = {

    home: {
        handler: async function(request, h) {
          const pois = await Poi.find().populate().lean();
            const use =  await User.find().populate().lean();
            //let county = "Carlow";
           // let user = await Poi.findByCounty(county); not used
            return h.view('home', {
                title: 'Poi information page',
                pois: pois
            });
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
      if (user.level === "basic") {
        const message = "insufficient rights"
        return h.view('home', {
          title: 'Poi data',
          user: user,
          errors: [{ message: message }],
          pois: pois
        });
      }
      else if (user.level === "admin") {
        return h.view('poiUpdate', {
          title: 'Update National school data',
          user: user,
          poi: poi
        });
      }
    }
  },
      updateDetails:{
          handler: async function(request, h) {
            var currentDate = new Date();
            var date = currentDate.getDate();
            var month = currentDate.getMonth(); //Be careful! January is 0 not 1
            var year = currentDate.getFullYear();
            var dateString = date + "-" +(month + 1) + "-" + year;
            const poi = request.payload;
            const id = request.auth.credentials.id;
            var user = await User.findById(id);
           const poiData = await Poi.findById(poi.id);  //used a hidden field in the form to pass through the id of the poiData

            if(typeof poiData.userUpdated==='undefined') //check to see if the field userUpdated has been entered into the db
            {
              console.log("sending user updating and date uploaded to the database");
              await poiData.updateOne({
                    userUpdated: user.id,
                    dateUpdated: dateString
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
            poiData.DEIS = poi.DEIS;
            poiData.Gaeltacht = poi.Gaeltacht;
            poiData.M_13_14 = parseInt(poi.Boy1314);
            poiData.F_13_14= parseInt(poi.Girl1314);
            poiData.T_13_14= parseFloat(poiData.M_13_14 + poiData.F_13_14,); //this forces the addition not concatenation of the addition
            //we don't save the total directly incase of incorrect entry
            poiData.xcoord = poi.xcoord;
            poiData.ycoord=poi.ycoord;
            poiData.Long=poi.Long;
            poiData.Lat=poi.Lat;
            poiData.userUpdated = user.id;
            poiData.dateUpdated = dateString;

           await poiData.save();
            return h.redirect('/home');



          }
        },



      //todo add a page for the update of POI information
    }



module.exports = Pois;