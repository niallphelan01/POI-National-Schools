'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const Boom = require('@hapi/boom');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: String,
    level: String
});

userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email: email });
};

//userSchema.methods.comparePassword = function(candidatePassword) {
//    const isMatch = this.password === candidatePassword;
//    if (!isMatch) {
//        throw Boom.unauthorized('Password mismatch');
//    }
//    return this;
//};

userSchema.methods.comparePassword = async function(userPassword) {        // EDITED
    const isMatch = await bcrypt.compare(userPassword, this.password);
    return isMatch;
};

module.exports = Mongoose.model('User', userSchema);
