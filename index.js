'use strict';
const ImageStore = require('./app/utils/image-store');
const Hapi = require('@hapi/hapi');
const dotenv = require('dotenv');
const Bell = require('@hapi/bell');
const AuthCookie = require('@hapi/cookie');

const result = dotenv.config();
if (result.error) {
    console.log(result.error.message);
    process.exit(1);
}


const credentials = {
    cloud_name: process.env.cloudinary_name,
    api_key: process.env.cloudinary_key,
    api_secret: process.env.cloudinary_secret_key
};

const os = require("os");

const server = Hapi.server({
    port: process.env.PORT || 3000
   // host: 'localhost'
});

require('./app/models/db');  //required to run mongodb

async function init() {
    await server.register(require('@hapi/inert'));
    await server.register(require('@hapi/vision'));
    //await server.register(require('@hapi/cookie'));
    await server.register([Bell, AuthCookie]);

    ImageStore.configure(credentials);

    server.auth.strategy('cookie-auth', 'cookie', { //strategy for protected routes
        cookie: {
            name: process.env.cookie_name,
            password: process.env.cookie_password,
            isSecure: false
        },
        redirectTo: '/'
    });

    var bellAuthOptions = {
        provider: 'github',
        password: 'github-encryption-password-secure', // String used to encrypt cookie
        // used during authorisation steps only
        clientId: process.env.githubclientID,          // *** Replace with your app Client Id ****
        clientSecret: process.env.githubsecret,  // *** Replace with your app Client Secret ***
        isSecure: false        // Should be 'true' in production software (requires HTTPS)
    };


    server.auth.strategy('github-oauth', 'bell', bellAuthOptions);
    server.auth.default('cookie-auth');

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
