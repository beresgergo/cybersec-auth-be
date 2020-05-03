'use strict';

const CONFIGURATION = require('../config/index');

const { handleHttpError } = require('../utils/httpHelpers');
const { HTTP_OK } = require('../utils/httpConstants');

const fetch = require('make-fetch-happen').defaults(CONFIGURATION.HTTP_CLIENT_DEFAULT_CONFIG);

module.exports.checkUsername = (req, res) => {
    const opts = CONFIGURATION.createCheckUsernameOptions(res.locals.validated.username);

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

module.exports.totpSecret = (req, res) => {
    const opts = CONFIGURATION.createTotpSecretOptions(res.locals.validated.username);
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

module.exports.publicKey = (req, res) => {
    const opts = CONFIGURATION.createPublicKeyOptions(res.locals.validated.username);
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

module.exports.finalize = (req, res) => {
    const opts = CONFIGURATION.createFinalizeOptions(res.locals.validated.username);
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
