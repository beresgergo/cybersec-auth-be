'use strict';

const MESSAGES = require('../utils/messages');
const { HTTP_BAD_REQUEST } = require('../utils/httpConstants');

const validator = require('validator');

const AUTH_TYPE_WHITELIST = Object.freeze(new Set(['MFA', 'RSA', 'TOTP']));
const BLACKLIST = '\\[\\]<>\\*';
const ZERO = 0;
const FOUR = 4;

function sanitizeInput(input) {
    return validator.blacklist(validator.escape(validator.trim(input)), BLACKLIST);
}

function isValidLength(input) {
    return validator.isLength(input, { min: 4, max: 10 });
}

function isValidTotpTokenlength(input) {
    return validator.isLength(input, { min: 6, max: 6 });
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

function isAuthTypeSupported(authType) {
    return AUTH_TYPE_WHITELIST.has(authType);
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
    const inputValidator = inputValidatorFactory([]);

    const result = inputValidator.validate(input);

    if (result.length === ZERO) {
        res.locals.validated.body.totpSecret = sanitizeInput(input);
        next();
        return;
    }

    return res.status(HTTP_BAD_REQUEST).json({messages: result});
};

module.exports.publicKeyValidator = (req, res, next) => {
    const input = req.body.publicKey;
    const inputValidator = inputValidatorFactory([{
        predicate: validator.isBase64,
        message: MESSAGES.PUBKEY_INVALID_ENCODING
    }]);

    const result = inputValidator.validate(input);

    if (result.length === ZERO) {
        res.locals.validated.body.publicKey = sanitizeInput(input);
        next();
        return;
    }

    return res.status(HTTP_BAD_REQUEST).json({messages: result});
};

module.exports.preferredAuthTypeValidator = (req, res, next) => {
    const input = req.body.preferredAuthType;

    const inputValidator = inputValidatorFactory([{
        predicate: isAuthTypeSupported,
        message: MESSAGES.PREFERRED_AUTH_TYPE_INVALID
    }]);

    const result = inputValidator.validate(input);

    if (result.length === ZERO) {
        res.locals.validated.body.preferredAuthType = sanitizeInput(input);
        next();
        return;
    }

    return res.status(HTTP_BAD_REQUEST).json({messages: result});
};

module.exports.jwtStringValidator = (req, res, next) => {
    const input = req.body.token;

    const inputValidator = inputValidatorFactory([{
        predicate: validator.isJWT,
        message: MESSAGES.JWT_INVALID
    }]);

    const result = inputValidator.validate(input);

    if (result.length === ZERO) {
        res.locals.validated.body.token = sanitizeInput(input);
        next();
        return;
    }

    return res.status(HTTP_BAD_REQUEST).json({messages: result});
};

module.exports.totpTokenValidator = (req, res, next) => {
    const input = req.body.token;

    const inputValidator = inputValidatorFactory([{
        predicate: validator.isNumeric,
        message: MESSAGES.TOTP_TOKEN_INVALID
    },{
        predicate: isValidTotpTokenlength,
        message: MESSAGES.TOTP_TOKEN_INVALID_LENGTH
    }]);

    const result = inputValidator.validate(input);

    if (result.length === ZERO) {
        res.locals.validated.body.token = sanitizeInput(input);
        next();
        return;
    }

    return res.status(HTTP_BAD_REQUEST).json({messages: result});
};

module.exports.signedChallengeValidator = (req, res, next) => {
    const input = req.body.signedChallenge;
    const inputValidator = inputValidatorFactory([{
        predicate: validator.isBase64,
        message: MESSAGES.SIGNATURE_INVALID_ENCODING
    }]);

    const result = inputValidator.validate(input);

    if (result.length === ZERO) {
        res.locals.validated.body.signedChallenge = sanitizeInput(input);
        next();
        return;
    }

    return res.status(HTTP_BAD_REQUEST).json({messages: result});
};
