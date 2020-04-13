'use strict';

const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
    id: { type: String, indexed: true },
    username: String,
    setPassword: String,
    confirmPassword: String,
    validUntil: Date
});

module.exports = mongoose.model('Session', sessionSchema, 'RegistrationSessionStore');
