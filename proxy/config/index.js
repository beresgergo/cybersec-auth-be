'use strict';

const HTTP_CONSTANTS = require('../utils/httpConstants');

const fs = require('fs');
const winston = require('winston');

module.exports.HTTP_CLIENT_DEFAULT_CONFIG = {
    key: fs.readFileSync('/var/opt/certs/cyberauth_proxy.key'),
    cert: fs.readFileSync('/var/opt/certs/cyberauth_proxy.crt'),
    ca: fs.readFileSync('/var/opt/certs/cyberauth_ca.crt')
};

module.exports.createCheckUsernameOptions = function(userId) {
    return {
        url: 'https://registration:8000/user/' + userId,
        opts: {
            method: HTTP_CONSTANTS.HTTP_METHOD_GET
        }
    };
};

module.exports.createTotpSecretOptions = function(userId) {
    return {
        url: 'https://registration:8000/user/' + userId + '/totpSecret',
        opts: {
            method: HTTP_CONSTANTS.HTTP_METHOD_POST,
            headers: {
                'Content-Type': HTTP_CONSTANTS.HTTP_APPLICATION_JSON
            }
        }
    };
};

module.exports.createPublicKeyOptions = function(userId) {
    return {
        url: 'https://registration:8000/user/' + userId + '/publicKey',
        opts: {
            method: HTTP_CONSTANTS.HTTP_METHOD_POST,
            headers: {
                'Content-Type': HTTP_CONSTANTS.HTTP_APPLICATION_JSON
            }
        }
    };
};

module.exports.createFinalizeOptions = function(userId) {
    return {
        url: 'https://registration:8000/user/' + userId + '/finalize',
        opts: {
            method: HTTP_CONSTANTS.HTTP_METHOD_POST,
            headers: {
                'Content-Type': HTTP_CONSTANTS.HTTP_APPLICATION_JSON
            }
        }
    };
};

module.exports.AUTH_BASE_CONFIG = {
    url: 'https://auth:8000/auth',
    opts: {
        method: HTTP_CONSTANTS.HTTP_METHOD_GET
    }
};

module.exports.PROTECTED_RESOURCE_CONFIG = {
    url: 'https://auth:8000/protected',
    opts: {
        method: HTTP_CONSTANTS.HTTP_METHOD_POST,
        headers: {
            'Content-Type': HTTP_CONSTANTS.HTTP_APPLICATION_JSON
        }
    }
};

module.exports.LOGGING_OPTIONS = {
    transports: [new winston.transports.Console()],
    requestWhitelist: ['headers', 'query', 'body'],
    responseWhitelist: ['body'],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    )
};

module.exports.CREDENTIALS = {
    key: fs.readFileSync('/var/opt/certs/cyberauth_proxy.key'),
    cert: fs.readFileSync('/var/opt/certs/cyberauth_proxy.crt'),
    ca: fs.readFileSync('/var/opt/certs/cyberauth_ca.crt')
};

module.exports.SERVER_PORT = 8080;
