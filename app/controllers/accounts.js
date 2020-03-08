'use strict';

const User = require('../models/user');
const Boom = require('@hapi/boom');
const nodemailer = require('nodemailer');
const Poi = require('../models/poi');

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
            return h.view('main', {title: 'Welcome to Poi site'});
        }
    },
    deleteUser:{
        auth: false,
        handler: async function(request, h) {
            const id = request.params.id;  //params.id given by the router with the ID (this.id from the view)
            const userToDelete = await User.findById(id);
            await userToDelete.delete();
            const users = await User.find().populate().lean();
            return h.view('userSettings', {
                title: 'Users',
                users: users
            });
        }
    },
    updateUserToAdmin:{
        auth: false,
        handler: async function(request, h) {
            const id = request.params.id;  //params.id given by the router with the ID (this.id from the view)
            const userToUpdate = await User.findById(id);
            userToUpdate.level = "admin";
            await userToUpdate.save();
            const users = await User.find().populate().lean();
            return h.view('userSettings', {
                title: 'Users',
                users: users
            });
        }
    },
    updateAdminToUser:{
        auth: false,
        handler: async function(request, h) {
            try {
                const id = request.params.id;
                //params.id given by the router with the ID (this.id from the view)
                const userToUpdate = await User.findById(id);
                userToUpdate.level = "basic";
                await userToUpdate.save();
                const users = await User.find().populate().lean();
                return h.view('userSettings', {
                    title: 'Users',
                    users: users
                });
            }
            catch (err){
                return h.view('updateUserRequest', { errors: [{ message: err.message }] });

            }
        }
    },
    superAdmin: {
        auth: false,
        handler: function (request, h) {
            return h.view('superAdminHome', {title: 'Welcome the superAdmin page'});
        }
    },
    admin: {
        auth: false,
        handler: async function (request, h) {
            const pois = await Poi.find().populate().lean();
            return h.view('adminHome', {
                title: 'National School admin page',
                pois: pois
            });
        }
        },
    showSignup: {
        auth: false,
        handler: function(request, h) {
            return h.view('signup', { title: 'Sign up for Poi Site' });
        }
    },
    showLogin: {
        auth: false,
        handler: function(request, h) {
            return h.view('login', { title: 'Login to POI site' });
        }
    },
    login: {
        auth: false,
        handler: async function(request, h) {
            const { email, password } = request.payload;
            try {
                let user = await User.findByEmail(email);
                if (!user) {
                    const message = 'Email address is not registered';
                    throw Boom.unauthorized(message);
                }
                user.comparePassword(password);
                request.cookieAuth.set({ id: user.id });
                if (user.level ==="superAdmin") {
                    return h.redirect('/superAdminHome');
                }
                else if(user.level ==="admin"){
                    return h.redirect('/adminHome');
                }
                else{
                    return h.redirect('/home');
                }
            } catch (err) {
                return h.view('login', { errors: [{ message: err.message }] });
            }
        }
    },
    logout: {
        auth: false,
        handler: function(request, h) {
            request.cookieAuth.clear();
            return h.redirect('/');
        }
    },
    updateUserRequestView: {
        handler: async function(request, h) {
            let userLevel;
            var id = request.auth.credentials.id;
            const user = await User.findById(id).lean();
            return h.view('updateUserRequest', { title: 'User settings update Request', user: user, userLevel: user.level });
        }

    },
    signup: {
        //TODO consider adding a repeat password for the MVC.
        auth: false,
        handler: async function(request, h) {
            const payload = request.payload;
            try {
                const level = "basic"; //initial user level
                const value = await schema.validateAsync({
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                    password: payload.password,
                    email: payload.email
                });
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
                    password: payload.password,
                    level: level
                });
                try {
                    user = await newUser.save();
                } catch (err) {
                    let message = 'unable to save user';
                    throw Boom.badData(message);
                }
                try {
                    request.cookieAuth.set({ id: user.id });
                    return h.redirect('/home');
                } catch (err) {
                    console.log("cookie implementation not working")
                }
            } catch (err) {
                console.log("Incorrect values used in fields");
                return h.view('signup', { errors: [{ message: err.message }] }); //show relevant error and ask the user to enter data again
                //TODO handle errors to the main page to explain why the validation failed.

            }
        }
    },
  userShowSettings:{
        handler: async function(request, h) {
            const users = await User.find().populate().lean();

            return h.view('userSettings', {
                title: 'Users',
                users: users
            });
        }
},
    showSettings: {
        handler: async function(request, h) {
            try {
                let userLevel;
                var id = request.auth.credentials.id;
                console.log("User ID: " +id);
                const user = await User.findById(id).lean();
                    return h.view('settings', { title: 'User settings', user: user, userLevel: user.level });

            }catch (err){
                return h.view ('login', {errors: [{message: err.message}]});
            }
        }
    },
    updateSettings: {
        handler: async function(request, h) {
            const payload = request.payload;
            try {
                const value = await schema.validateAsync({firstName: payload.firstName, lastName: payload.lastName, password: payload.password, email: payload.email});
            const id = request.auth.credentials.id;
            const user = await User.findById(id);
            user.firstName = payload.firstName;
            user.lastName = payload.lastName;
            user.email = payload.email;
            user.password = payload.password;
            await user.save();
            return h.redirect('/home');
        }catch (err){
                var id = request.auth.credentials.id;
                const user = await User.findById(id).lean();
                return h.view('settings', {title: 'User settings', user: user, errors: [{message: err.message}]});
            }
        }

    },
    email: {
        auth: false,
        handler: async function(request,h){
            const payload = request.payload;

            var transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                service: 'gmail',
                auth: {
                    user: process.env.adminEmail,
                    pass: process.env.adminEmailPassword
                }
            });

            var mailOptions = {
                from: process.env.adminEmail,
                to: payload.email,
                bcc: process.env.adminEmail,
                subject: 'Admin request',
                text: 'Dear ' + payload.firstName + " " + payload.lastName + ", \n\nWe have received your request for update to admin status."
                        + "\n\nYour request: " + payload.requestText + "\n\n Regards\n\n Admin Team"
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
            return h.redirect('/home');
        }
    },

};
module.exports = Accounts;