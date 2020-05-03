'use strict';

const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
    id: { type: String, indexed: true },
    username: String,
    totpSecret: String,
    publicKey: String,
    validUntil: Date
});

module.exports = mongoose.model('Session', sessionSchema, 'RegistrationSessionStore');
