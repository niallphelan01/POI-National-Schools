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
  update:{
    handler: async function(request, h) {
      const id = request.params.id;
      console.log(id);

      //todo add a page for the update of POI information
    }

  },


}

module.exports = Pois;