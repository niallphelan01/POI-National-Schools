'use strict';

const Accounts = require('./app/controllers/accounts');
const Pois = require('./app/controllers/poi');
const Gallery = require('./app/controllers/gallery');

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

    { method: 'GET', path: '/superAdminHome', config: Accounts.superAdmin},
    {method: 'GET', path: '/userSettings/deleteUser/{id}', config: Accounts.deleteUser},
    {method: 'GET', path: '/userSettings/updateUserToAdmin/{id}', config: Accounts.updateUserToAdmin},
    {method: 'GET', path: '/userSettings/updateAdminToUser/{id}', config: Accounts.updateAdminToUser},

    { method: 'GET', path: '/updateUserRequest', config: Accounts.updateUserRequestView },
    { method: 'POST', path: '/email', config: Accounts.email },
    { method: 'GET', path: '/adminHome', config: Accounts.admin},

    { method: 'GET', path: '/home', config: Pois.home },
    { method: 'GET', path: '/newPoi', config: Pois.showPoi },
    { method: 'POST', path: '/newPoi', config: Pois.newPoi },
    { method: 'GET', path: '/updatePoi/{id}', config: Pois.showDetails},
    {method: 'GET', path: '/deletePoi/{id}', config: Pois.deletePoi},
    { method: 'Post', path: '/poiUpdate', config: Pois.updateDetails},
    {method: 'POST', path: '/uploadImageRequest/{id}', config: Gallery.uploadFile},

    //{ method: 'Post', path: '/poiUpdate', config: Pois.uploadImage},

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
