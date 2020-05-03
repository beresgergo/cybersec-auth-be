'use strict';

const CONFIGURATION = require('../config/index');

const { handleHttpError } = require('../utils/httpHelpers');
const { HTTP_OK } = require('../utils/httpConstants');

const fetch = require('make-fetch-happen').defaults(CONFIGURATION.HTTP_CLIENT_DEFAULT_CONFIG);

module.exports.deleteUser = (req, res) => {
    const opts = CONFIGURATION.deleteUserOptions;
    opts.opts.body = JSON.stringify(req.body);

    fetch(opts.url, opts.opts).then(response => {
        if (!response.ok) {
            handleHttpError(response, res);
        }
        return response.json();
    }).then(body => {
        return res
            .status(HTTP_OK)
            .json(body);
    });
};

module.exports.changePreferredAuthType = (req, res) => {
    const opts = CONFIGURATION.changePreferredAuthType;
    opts.opts.body = JSON.stringify(req.body);

    fetch(opts.url, opts.opts).then(response => {
        if (!response.ok) {
            handleHttpError(response, res);
        }
        return response.json();
    }).then(body => {
        return res
            .status(HTTP_OK)
            .json(body);
    });
};
