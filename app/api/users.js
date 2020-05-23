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
  }

};

module.exports = Users;