'use strict'

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Boom = require('@hapi/boom');

const poiSchema = new Schema({
    AIRO_ID: Number,
    Roll_No: String,
    Off_Name: String,
    Add1_1: String,
    Add_2: String,
    Add_3: String,
    Add_4: String,
    County: String,
    Ethos: String,
    Island : String,
    DEIS: String,
    Gaeltacht: String,
    M_13_14: Number,
    F_13_14: Number,
    T_13_14: Number,
    xcoord: Number,
    ycoord: Number,
    Long: Number,
    Lat: Number
});

poiSchema.statics.findByCounty= function(county) {
    return this.find({County: county });
};

module.exports = Mongoose.model('Poi', poiSchema);
