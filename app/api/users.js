'use strict';
const Boom = require('@hapi/boom'); // required to give the response of not found etc

const User = require('../models/user');

const Users = {
  find: {
    auth: false,
    handler: async function(request, h) {
      const users = await User.find();
      return users;
    }
  },
  findOne: {
    auth: false,
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
      const user = await newUser.save();
      if (user) {
        return h.response(user).code(201);
      }
      return Boom.badImplementation('error creating user');
    }
  },

  deleteAll: {
    auth: false,
    handler: async function(request, h) {
      await User.remove({});
      return { success: true };
    }
  },

  deleteOne: {
    auth: false,
    handler: async function(request, h) {
      const response = await User.deleteOne({ _id: request.params.id });
      if (response.deletedCount == 1) {
        return { success: true };
      }
      return Boom.notFound('id not found');
    }
  }

};

module.exports = Users;