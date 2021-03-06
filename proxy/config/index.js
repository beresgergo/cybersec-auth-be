'use strict';

const HTTP_CONSTANTS = require('../utils/httpConstants');

const fs = require('fs');
const winston = require('winston');

module.exports.HTTP_CLIENT_DEFAULT_CONFIG = {
    key: fs.readFileSync('/var/opt/certs/cyberauth_proxy.key'),
    cert: fs.readFileSync('/var/opt/certs/cyberauth_proxy.crt'),
    ca: fs.readFileSync('/var/opt/certs/cyberauth_ca.crt')
};

module.exports.createCheckUsernameOptions = userId => {
    return {
        url: 'https://registration:8000/user/' + userId,
        opts: {
            method: HTTP_CONSTANTS.HTTP_METHOD_GET
        }
    };
};

module.exports.createTotpSecretOptions = userId => {
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

module.exports.createPublicKeyOptions = userId => {
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

module.exports.createFinalizeOptions = userId => {
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

module.exports.createAuthenticationStartOptions = userId => {
    return {
        url: 'https://auth:8000/login/' + userId,
        opts: {
            method: HTTP_CONSTANTS.HTTP_METHOD_GET,
            headers: {
                'Content-Type': HTTP_CONSTANTS.HTTP_APPLICATION_JSON
            }
        }
    };
};

module.exports.postTotpTokenOptions = {
    url: 'https://auth:8000/login/otpToken',
    opts: {
        method: HTTP_CONSTANTS.HTTP_METHOD_POST,
        headers: {
            'Content-Type': HTTP_CONSTANTS.HTTP_APPLICATION_JSON
        }
    }
};

module.exports.generateChallengeOptions = {
    url: 'https://auth:8000/login/challenge',
    opts: {
        method: HTTP_CONSTANTS.HTTP_METHOD_POST,
        headers: {
            'Content-Type': HTTP_CONSTANTS.HTTP_APPLICATION_JSON
        }
    }
};

module.exports.checkSignatureOptions = {
    url: 'https://auth:8000/login/signedChallenge',
    opts: {
        method: HTTP_CONSTANTS.HTTP_METHOD_POST,
        headers: {
            'Content-Type': HTTP_CONSTANTS.HTTP_APPLICATION_JSON
        }
    }
};

module.exports.retrieveTokenOptions = {
    url: 'https://auth:8000/retrieveToken',
    opts: {
        method: HTTP_CONSTANTS.HTTP_METHOD_POST,
        headers: {
            'Content-Type': HTTP_CONSTANTS.HTTP_APPLICATION_JSON
        }
    }
};

module.exports.validateTokenOptions = {
    url: 'https://auth:8000/verifyToken',
    opts: {
        method: HTTP_CONSTANTS.HTTP_METHOD_POST,
        headers: {
            'Content-Type': HTTP_CONSTANTS.HTTP_APPLICATION_JSON
        }
    }
};

module.exports.AUTH_BASE_CONFIG = {
    url: 'https://auth:8000/',
    opts: {
        method: HTTP_CONSTANTS.HTTP_METHOD_GET
    }
};

module.exports.deleteUserOptions = {
    url: 'https://userservice:8000/user',
    opts: {
        method: HTTP_CONSTANTS.HTTP_METHOD_DELETE,
        headers: {
            'Content-Type': HTTP_CONSTANTS.HTTP_APPLICATION_JSON
        }
    }
};

module.exports.changePreferredAuthType = {
    url: 'https://userservice:8000/user/preferredAuthType',
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
