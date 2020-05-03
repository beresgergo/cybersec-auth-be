'use strict';

const MESSAGES = require('../utils/messages');
const { HTTP_BAD_REQUEST } = require('../utils/httpConstants');

const validator = require('validator');

const BLACKLIST = '\\[\\]<>\\*';
const ZERO = 0;
const FOUR = 4;

function sanitizeInput(input) {
    return validator.blacklist(validator.escape(validator.trim(input)), BLACKLIST);
}

function isValidLength(input) {
    return validator.isLength(input, { min: 4, max: 10 });
}

function is32BytesLength(input) {
    return validator.isByteLength(input, {min: 52, max: 52});
}

function isUUIDV4(input) {
    return validator.isUUID(input, FOUR);
}

function inputValidatorFactory(rules) {
    return {
        validate: input => {
            return rules
                .filter(rule => !rule.predicate(input))
                .map(rule => rule.message);
        }
    };
}

module.exports.setupValidValueHolders = (_, res, next) => {
    res.locals.validated = {};
    res.locals.validated.params = {};
    res.locals.validated.body = {};
    next();
};

module.exports.userNameValidator = (req, res, next) => {
    const input = req.params.username;
    const inputValidator = inputValidatorFactory([{
        predicate: validator.isAlphanumeric,
        message: MESSAGES.USERNAME_INVALID_CHARACTERS
    },{
        predicate: isValidLength,
        message: MESSAGES.USERNAME_INVALID_LENGTH
    }]);

    const result = inputValidator.validate(input);

    if (result.length === ZERO) {
        res.locals.validated.params.username = sanitizeInput(input);
        next();
        return;
    }

    return res.status(HTTP_BAD_REQUEST).json({messages: result});
};

module.exports.sessionIdValidator = (req, res, next) => {
    const input = req.body.sessionId;
    const inputValidator = inputValidatorFactory([{
        predicate: isUUIDV4,
        message: MESSAGES.SESSION_INVALID
    }]);

    const result = inputValidator.validate(input);

    if (result.length === ZERO) {
        res.locals.validated.body.sessionId = sanitizeInput(input);
        next();
        return;
    }

    return res.status(HTTP_BAD_REQUEST).json({messages: result});
};

module.exports.totpValidator = (req, res, next) => {
    const input = req.body.totpSecret;
    const inputValidator = inputValidatorFactory([{
        predicate: validator.isAlphanumeric,
        message: MESSAGES.TOTP_INVALID
    },{
        predicate: is32BytesLength,
        message:  MESSAGES.TOTP_INVALID
    }]);

    const result = inputValidator.validate(input);

    if (result.length === ZERO) {
        res.locals.validated.body.totpSecret = sanitizeInput(input);
        next();
        return;
    }

    return res.status(HTTP_BAD_REQUEST).json({messages: result});
};
