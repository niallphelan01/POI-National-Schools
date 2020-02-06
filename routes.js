'use strict';

const Accounts = require('./app/controllers/accounts');
module.exports = [
    { method: 'GET', path: '/', config: Accounts.index },
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
