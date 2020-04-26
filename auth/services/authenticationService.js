'use strict';

const { JWT, LOGGING_OPTIONS } = require('../config/index');
const { STATUS_OK } = require('../utils/messages');

const { sign, verify } = require('jsonwebtoken');
const { createLogger } = require('winston');

const LOG = createLogger(LOGGING_OPTIONS);

module.exports.createAuthenticationToken = () => {
    return new Promise((resolve, _) => {
        sign({ status: STATUS_OK }, JWT.privateKey, JWT.options, (_, token) => {
            LOG.info('Successfully created JWT: ' + token);
            resolve(token);
        });
    });
};

module.exports.validateToken = (token) => {
    return new Promise((resolve, reject) => {
        verify(token, JWT.publicKey, JWT.signOptions,(error, _) => {
            if (error) {
                LOG.error('Could not verify signature of token: ' + token);
                LOG.error('Reason: ' + error.message);
                reject(error);
                return;
            }
            resolve();
        });
    });
};
