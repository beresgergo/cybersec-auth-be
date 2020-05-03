'use strict';

const MESSAGES = require('../utils/messages');
const { HTTP_BAD_REQUEST } = require('../utils/httpConstants');

const validator = require('validator');

const BLACKLIST = '\\[\\]<>\\*';
const ZERO = 0;

function sanitizeInput(input) {
    return validator.blacklist(validator.escape(validator.trim(input)), BLACKLIST);
}

function isValidLength(input) {
    return validator.isLength(input, { min: 4, max: 10 });
}

/*function isUUIDV4(input) {
    return validator.isUUID(input, 4);
}*/

function inputValidatorFactory(rules) {
    return {
        validate: input => {
            return rules
                .filter(rule => !rule.predicate(input))
                .map(rule => rule.message);
        }
    };
}

module.exports.userNameValidator = (req, res, next) => {
    const input = req.params.username;
    const inputValidator = inputValidatorFactory([{
        predicate: validator.isAlphanumeric,
        message: MESSAGES.USERNAME_INVALID_CHARACTERS
    },{
        predicate: isValidLength,
        message: 'Name should be between 4 and 10 characters'
    }]);

    const result = inputValidator.validate(input);

    if (result.length === ZERO) {
        res.locals.validated = {};
        res.locals.validated.username = sanitizeInput(input);
        next();
        return;
    }

    return res.status(HTTP_BAD_REQUEST).json({messages: result});
};
