'use strict';

const CONFIGURATION = require('../config/index');
const fetch = require('make-fetch-happen').defaults(CONFIGURATION.HTTP_CLIENT_DEFAULT_CONFIG);
const winston = require('winston');
const LOG = winston.createLogger(CONFIGURATION.LOGGING_OPTIONS);

const HTTP_OK = 200;

function handleHttpError(response, res) {
    response
        .json()
        .then(body => {
            LOG.error('Request failed with statusCode:' + response.statusCode);
            LOG.error('Payload ' + JSON.stringify(response.error));
            res.status(response.status);
            res.json(body);
        });
}

module.exports.checkUsername = (req, res) => {
    const opts = CONFIGURATION.createCheckUsernameOptions(req.params.username);

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
    const opts = CONFIGURATION.createTotpSecretOptions(req.params.username);
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
    const opts = CONFIGURATION.createPublicKeyOptions(req.params.username);
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
    const opts = CONFIGURATION.createFinalizeOptions(req.params.username);
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
