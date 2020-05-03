'use strict';

const { JWT, LOGGING_OPTIONS } = require('../config/index');

const { verify } = require('jsonwebtoken');
const { createLogger } = require('winston');

const LOG = createLogger(LOGGING_OPTIONS);

module.exports.verifyToken = token => {
    return new Promise((resolve, reject) => {
        verify(token, JWT.publicKey, JWT.signOptions,(error, decoded) => {
            if (error) {
                LOG.error('Could not verify signature of token: ' + token);
                LOG.error('Reason: ' + error.message);
                reject(error);
                return;
            }
            LOG.info('JWT verification successful.');
            resolve(decoded);
        });
    });
};
