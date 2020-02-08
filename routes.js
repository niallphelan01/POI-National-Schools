'use strict';

const Accounts = require('./app/controllers/accounts');
const Pois = require('./app/controllers/poi');
module.exports = [
    { method: 'GET', path: '/', config: Accounts.index },
    { method: 'GET', path: '/signup', config: Accounts.showSignup },
    { method: 'GET', path: '/login', config: Accounts.showLogin },
    { method: 'POST', path: '/signup', config: Accounts.signup },

    { method: 'GET', path: '/home', config: Pois.home },
    {
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: './public'
            }
        },
        options: { auth: false }
    }
];
