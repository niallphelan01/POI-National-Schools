'use strict';
const Boom = require('@hapi/boom'); // required to give the response of not found etc
const utils = require('./utils.js');
const User = require('../models/user');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');          // ADDED
const saltRounds = 10;

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

const Users = {
  authenticate: {
    auth: false,
    handler: async function (request, h) {
      try {
        const user = await User.findOne({ email: request.payload.email });
        if (!user) {
          return Boom.unauthorized('User not found');
        }
          else if (!await user.comparePassword(request.payload.password)) {
            return Boom.unauthorized('Invalid password');
        } else {
          const token = utils.createToken(user);
          return h.response({ success: true, token: token }).code(201);
        }
      } catch (err) {
        return Boom.notFound('internal db failure');
      }
    },
  },
  find: {
    auth: {strategy: 'jwt'},
    handler: async function(request, h) {
      const users = await User.find();
      return users;
    }
  },
  findOne: {
    auth: {strategy: 'jwt'},
    handler: async function(request, h) {
      try {
        const user = await User.findOne({ _id: request.params.id });
        if (!user) {
          return Boom.notFound('No User with this id');  //error for same lenght but incorrect id error
        }
        return user;
      } catch (err) {
        return Boom.notFound('No User with this id');  //error for any length but incorrect id error
      }
    }
  },
  create: {
    auth: false,
    handler: async function(request, h) {
      const newUser = new User(request.payload);
      try {
        const level = "basic"; //initial user level
        const value = await schema.validateAsync({
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          password: newUser.password,
          email: newUser.email
        });
        const hash = await bcrypt.hash(request.payload.password, saltRounds);
        newUser.password = hash;
        const user = await newUser.save();
        if (user) {
          return h.response(user).code(201);
        }
      }
      catch(e){
        return Boom.badImplementation('error creating user' + e);
      }

    }
  },

  deleteAll: {
    auth: {strategy: 'jwt'},
    handler: async function(request, h) {
      await User.remove({});
      return { success: true };
    }
  },

  deleteOne: {
    auth: {strategy: 'jwt'},
    handler: async function(request, h) {
      const response = await User.deleteOne({ _id: request.params.id });
      if (response.deletedCount === 1) {
        return { success: true };
      }
      return Boom.notFound('id not found');
    }
  },
  updateOne: {
    auth: {strategy: 'jwt'},
    handler: async function (request, h) {
      var userData = await User.findById(request.params.id);
      console.log("User object")
      console.log(userData);
      const newUser = request.payload;
      console.log("New User object")
      console.log(newUser);
      const hash = await bcrypt.hash(newUser.password, saltRounds); //hash the password
      userData.firstName = newUser.firstName;
      userData.lastName = newUser.lastName;
      userData.email = newUser.email;
      userData.password = hash;
      userData.level = newUser.level;


      try {
        let userResponse = await userData.save();
        return userResponse;
      } catch (err) {
        console.log(err)
      }
    }
  }
};

module.exports = Users;