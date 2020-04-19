'use strict';

const CONFIGURATION = require('../config/index');
const HTTP_CONSTANTS = require('../utils/httpConstants');

const fetch = require('make-fetch-happen').defaults(CONFIGURATION.HTTP_CLIENT_DEFAULT_CONFIG);

module.exports.getAuthenticationToken = (req, res) => {
    fetch(CONFIGURATION.AUTH_BASE_CONFIG.url).then(response => {
        return response.json();
    }).then(body => {
        return res
            .status(HTTP_CONSTANTS.HTTP_OK)
            .json({
                authorizationToken: body.token
            });
    }, () => {
        return res
            .status(HTTP_CONSTANTS.HTTP_UNAUTHORIZED)
            .json({
                failed: 'failed'
            });
    });
};

module.exports.getProtectedResource = (req, res) => {
    const opts = CONFIGURATION.PROTECTED_RESOURCE_CONFIG.opts;
    opts.body = JSON.stringify(req.body);

    fetch(CONFIGURATION.PROTECTED_RESOURCE_CONFIG.url, opts).then(response => {
        if (!response.ok) {
            throw Error(response.statusText);
        }

        return response.json();
    }).then(body => {
        return res
            .status(HTTP_CONSTANTS.HTTP_OK)
            .json(body)
    }).catch(() => {
        return res
            .status(HTTP_CONSTANTS.HTTP_UNAUTHORIZED)
            .json({});
    });
};

module.exports.ping = (req, res) => {
    return res
        .status(HTTP_CONSTANTS.HTTP_OK)
        .json({
            status: 'OK'
        });
};
