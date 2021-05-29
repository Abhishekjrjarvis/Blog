const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    firstname:{
        type: String,
        lowercase: true,
        required: true
    },
    lastname:{
        type: String,
        lowercase: true,
        min: 1,
        max: 1,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    countryCode: {
        type: String,
        required: true
    },
    contactNumber: {
        type: Number
    }

})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);