'use strict';

const CONFIGURATION = require('../config/index');
const HTTP_CONSTANTS = require('../utils/httpConstants');
const request = require('request-promise-native');


module.exports.getAuthenticationToken = (req, res) => {
    const promise = request.get(CONFIGURATION.authBaseConfig);

    promise.then(response => {
        return res
            .status(HTTP_CONSTANTS.HTTP_OK)
            .json({
                authorizationToken: response.token
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
    const opts = CONFIGURATION.getProtectedResourceConfig;
    opts.json = req.body;
    const promise = request.post(opts);

    promise.then(response => {
        return res
            .status(HTTP_CONSTANTS.HTTP_OK)
            .json(response);
    }, () => {
        return res.status(HTTP_CONSTANTS.HTTP_UNAUTHORIZED).json({});
    });
};

module.exports.ping = (req, res) => {
    return res
        .status(HTTP_CONSTANTS.HTTP_OK)
        .json({
            status: 'OK'
        });
};
