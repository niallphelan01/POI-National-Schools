'use strict';

const User = require('../models/user');

const Pois = {

    home: {
        handler: function(request, h) {
            return h.view('home', { title: 'Poi information page' });
        }
    },


}

module.exports = Pois;