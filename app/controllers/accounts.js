'use strict';

const Accounts = {
    index: {
        auth: false,
        handler: function (request, h) {
            return h.view('main', {title: 'Welcome to Donations'});
        }
    },
    showSignup: {
        auth: false,
        handler: function(request, h) {
            return h.view('signup', { title: 'Sign up for Donations' });
        }
    },
    showLogin: {
        auth: false,
        handler: function(request, h) {
            return h.view('login', { title: 'Login to Donations' });
        }
    },

};
module.exports = Accounts;