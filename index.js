'use strict';

const Hapi = require('@hapi/hapi');
require('dotenv').config();

const server = Hapi.server({
    port: 3000,
    host: 'localhost'
});



async function init() {
    await server.register(require('@hapi/inert'));
    await server.register(require('@hapi/vision'));
    await server.register(require('@hapi/cookie'));

    server.auth.strategy('session', 'cookie', {
        cookie: {
            name: process.env.cookie_name,
            password: process.env.cookie_password,
            isSecure: false
        },
        redirectTo: '/'
    });

    server.auth.default('session');

    let __dirname;
    server.views({
        engines: {
            hbs: require('handlebars')
        },
        relativeTo: __dirname,
        path: './app/views',
        layoutPath: './app/views/layouts',
        partialsPath: './app/views/partials',
        layout: true,
        isCached: false
    });

    server.route(require('./routes'));
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
}

process.on('unhandledRejection', err => {
    console.log(err);
    process.exit(1);
});

init();
