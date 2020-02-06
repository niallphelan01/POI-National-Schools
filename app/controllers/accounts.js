'use strict';

const Accounts = {
    index: {
        auth: false,
        handler: function (request, h) {
            return h.view('main', {title: 'Welcome to Donations'});
        }
    },

};
module.exports = Accounts;