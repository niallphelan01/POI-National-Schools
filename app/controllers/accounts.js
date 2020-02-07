'use strict';

const User = require('../models/user');
const Boom = require('@hapi/boom');

const Joi = require('@hapi/joi');
//TODO rationalise the validations further as they a currently very simplified
const schema = Joi.object({
    firstName: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    lastName: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','ie','co.uk'] } })
        .required()
});
   // .with('firstName', 'lastName','password','email'); //all four fields are required for form validation

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
    signup: {
        //TODO consider adding a repeat password for the MVC.
        auth: false,
        handler: async function(request, h) {
            const payload = request.payload;
            try {
                const value = await schema.validateAsync({firstName: payload.firstName, lastName: payload.lastName, password: payload.password, email: payload.email});
                //test the fields against the validation information above
                console.log("Validation tests completed successfully")
                let user = await User.findByEmail(payload.email);
                if (user) {
                    let message = 'Email address is already registered';
                    throw Boom.badData(message);
                }
                const newUser = new User({
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                    email: payload.email,
                    password: payload.password
                });
                try{
                    user = await newUser.save();
                 } catch (err) {
                    let message = 'unable to save user';
                    throw Boom.badData(message);
                }
               try {
                   request.cookieAuth.set({id: user.id});
                   return h.redirect('/home');
               }
               catch (err)
               {
                   console.log("cookie implementation not working")
               }
            }
            catch (err) {
                console.log("Incorrect values used in fields" );
                return h.view('signup', { errors: [{ message: err.message }] }); //show relevant error and ask the user to enter data again
                //TODO handle errors to the main page to explain why the validation failed.

            }
        }
    },

};
module.exports = Accounts;