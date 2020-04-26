'use strict';

const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
    id: { type: String, indexed: true },
    username: String,
    totpDone: Boolean,
    preferredAuthType: String,
    challenge: String,
    rsaDone: Boolean,
    valid: Date
});

module.exports = mongoose.model('Session', sessionSchema, 'AuthenticationSessionStore');
