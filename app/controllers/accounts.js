'use strict';

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
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
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
        auth: false,
        handler: async function(request, h) {
            const data = request.payload;
            try {
                const value = await schema.validateAsync({firstName: data.firstName, lastName: data.lastName, password: data.password, email:data.email});
                //test the fields against the validation information above
                console.log("Validation tests okay for data included")
            }
            catch (err) {
                console.log("Incorrect values used in fields" );
                //TODO handle errors to the main page to explain why the validation failed.
                return h.redirect('/home');//reload the same page to all the user to re-enter information
            }
        }
    },

};
module.exports = Accounts;