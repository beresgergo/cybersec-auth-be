'use strict';

const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
    id: { type: String, indexed: true },
    username: String,
    password: String,
    challenge: String,
    valid: Date
});

module.exports = mongoose.model('Session', sessionSchema, 'AuthenticationSessionStore');
