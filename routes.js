'use strict';

const Accounts = require('./app/controllers/accounts');
const Pois = require('./app/controllers/poi');
module.exports = [
    { method: 'GET', path: '/', config: Accounts.index },
    { method: 'GET', path: '/signup', config: Accounts.showSignup },
    { method: 'GET', path: '/login', config: Accounts.showLogin },
    { method: 'POST', path: '/signup', config: Accounts.signup },
    { method: 'GET', path: '/logout', config: Accounts.logout },
    { method: 'POST', path: '/login', config: Accounts.login },
    { method: 'GET', path: '/settings', config: Accounts.showSettings },
    { method: 'POST', path: '/settings', config: Accounts.updateSettings },
    { method: 'GET', path: '/userAccountSettings', config: Accounts.userShowSettings },
    //{ method: 'POST', path: '/settings', config: Accounts.userUpdateSettings },
    { method: 'GET', path: '/superAdminHome', config: Accounts.superAdmin},
    {method: 'GET', path: '/userSettings/deleteUser/{id}', config: Accounts.deleteUser},




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
