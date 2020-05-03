'use strict';

const tokenService = require('../services/tokenService');

const HTTP_CONSTANTS = require('../utils/httpConstants');
const MESSAGES = require('../utils/messages');

module.exports.verifyToken = (req, res, next) => {
    const promise = tokenService.verifyToken(req.body.token);

    promise.then(decoded => {
        res.locals.username = decoded.username;
        next();
    }, () => {
        return res.status(HTTP_CONSTANTS.HTTP_UNAUTHORIZED).json({ message : MESSAGES.INVALID_JWT_TOKEN });
    });
};
