'use strict';

const CONFIGURATION = require('../config/index');

const { handleHttpError } = require('../utils/httpHelpers');
const { HTTP_OK } = require('../utils/httpConstants');

const fetch = require('make-fetch-happen').defaults(CONFIGURATION.HTTP_CLIENT_DEFAULT_CONFIG);

module.exports.deleteUser = (req, res) => {
    const opts = CONFIGURATION.deleteUserOptions;
    opts.opts.body = JSON.stringify(res.locals.validated.body);

    fetch(opts.url, opts.opts).then(response => {
        return response.json();
    }).then(body => {
        if (!body.message) {
            return res
                .status(HTTP_OK)
                .json(body);
        }

        return res.status(HTTP_BAD_REQUEST).json(body);
    });
};

module.exports.changePreferredAuthType = (req, res) => {
    const opts = CONFIGURATION.changePreferredAuthType;
    opts.opts.body = JSON.stringify(res.locals.validated.body);

    fetch(opts.url, opts.opts).then(response => {
        return response.json();
    }).then(body => {
        if (!body.message) {
            return res
                .status(HTTP_OK)
                .json(body);
        }

        return res.status(HTTP_BAD_REQUEST).json(body);
    });
};
