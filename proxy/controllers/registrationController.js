'use strict';

const CONFIGURATION = require('../config/index');

const { HTTP_OK, HTTP_BAD_REQUEST } = require('../utils/httpConstants');

const fetch = require('make-fetch-happen').defaults(CONFIGURATION.HTTP_CLIENT_DEFAULT_CONFIG);

module.exports.checkUsername = (req, res) => {
    const opts = CONFIGURATION.createCheckUsernameOptions(res.locals.validated.params.username);

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

module.exports.totpSecret = (req, res) => {
    const opts = CONFIGURATION.createTotpSecretOptions(res.locals.validated.params.username);
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

module.exports.publicKey = (req, res) => {
    const opts = CONFIGURATION.createPublicKeyOptions(res.locals.validated.params.username);
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

module.exports.finalize = (req, res) => {
    const opts = CONFIGURATION.createFinalizeOptions(res.locals.validated.params.username);
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
