'use strict';

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: String,
    totpSecret: String,
    publicKey: String,
    preferredAuthType: String
});

module.exports = mongoose.model('UserStore', userSchema, 'UserStore');
