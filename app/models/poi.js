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
    Lat: Number,
    dateUpdated: String,
    userUpdated: {
        type: Schema.Types.ObjectId,
        ref: 'User'

    },
    cloudinary_public_id: String,
    cloudinary_secure_url: String,
    Region: String
});

poiSchema.statics.findByRegion= function(region) {
    return this.find({Region: region });
};

module.exports = Mongoose.model('Poi', poiSchema);
