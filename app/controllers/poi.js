'use strict';

const User = require('../models/user');
const Poi = require('../models/poi');

const Pois = {

    home: {
        handler: async function(request, h) {
          const pois = await Poi.find().populate().lean();
            const use =  await User.find().populate().lean();
            let county = "Carlow";
            let user = await Poi.findByCounty(county);
            //console.log(use);
            console.log(user);
            //console.log(pois);
            return h.view('home', {
                title: 'Poi information page',
                pois: pois
            });
        }
    },


}

module.exports = Pois;