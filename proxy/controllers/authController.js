'use strict';

const CONFIGURATION = require('../config/index');

const { HTTP_OK, HTTP_BAD_REQUEST } = require('../utils/httpConstants');

const fetch = require('make-fetch-happen').defaults(CONFIGURATION.HTTP_CLIENT_DEFAULT_CONFIG);

module.exports.startAuthentication = (req, res) => {
    const opts = CONFIGURATION.createAuthenticationStartOptions(res.locals.validated.params.username);

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

module.exports.verifyTotpToken = (req, res) => {
    const opts = CONFIGURATION.postTotpTokenOptions;
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

module.exports.generateChallenge = (req, res) => {
    const opts = CONFIGURATION.generateChallengeOptions;

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

module.exports.checkSignature = (req, res) => {
    const opts = CONFIGURATION.checkSignatureOptions;
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

module.exports.retrieveToken = (req, res) => {
    const opts = CONFIGURATION.retrieveTokenOptions;
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
