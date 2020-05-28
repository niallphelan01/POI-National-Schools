'use strict'

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Boom = require('@hapi/boom');


const locationSchema = new Schema({
  lng: Number,
  lat: Number,
});

module.exports = Mongoose.model('location', locationSchema);