'use strict';

const CONFIGURATION = require('../config/index');
const request = require('request-promise-native');
const winston = require('winston');
const LOG = winston.createLogger(CONFIGURATION.LOGGING_OPTIONS);

const HTTP_OK = 200;

module.exports.checkUsername = (req, res) => {
    const opts = Object.assign({}, CONFIGURATION.registrationConfig);
    opts.uri += '/' + req.params.username;

    const promise = request.get(opts);

    promise.then(response => {
        return res
            .status(HTTP_OK)
            .json({
                status: response.status,
                sessionId: response.sessionId
            });
    }, response => {
        LOG.error('Request failed with statusCode:' + response.statusCode);
        LOG.error('Payload ' + JSON.stringify(response.error));
        return res
            .status(response.statusCode)
            .json({ message: response.error.message });
    });
};

module.exports.setPassword = (req, res) => {
    const opts = Object.assign({}, CONFIGURATION.registrationConfig);
    opts.uri += '/' + req.params.username + '/setPassword';
    opts.json = req.body;
    const promise = request.post(opts);

    promise.then(response => {
        return res
            .status(HTTP_OK)
            .json({
                status: response.status,
                sessionId: response.sessionId
            });
    }, response => {
        LOG.error('Request failed with statusCode:' + response.statusCode);
        LOG.error('Payload ' + JSON.stringify(response.error));
        return res
            .status(response.statusCode)
            .json({ message: response.error.message });
    });
};

module.exports.confirmPassword = (req, res) => {
    const opts = Object.assign({}, CONFIGURATION.registrationConfig);
    opts.uri += '/' + req.params.username + '/confirmPassword';
    opts.json = req.body;
    const promise = request.post(opts);

    promise.then(response => {
        return res
            .status(HTTP_OK)
            .json({
                status: response.status,
                sessionId: response.sessionId
            });
    }, response => {
        LOG.error('Request failed with statusCode:' + response.statusCode);
        LOG.error('Payload ' + JSON.stringify(response.error));
        return res
            .status(response.statusCode)
            .json({ message: response.error.message });
    });
};

module.exports.finalize = (req, res) => {
    const opts = Object.assign({}, CONFIGURATION.registrationConfig);
    opts.uri += '/' + req.params.username + '/finalize';
    opts.json = req.body;
    const promise = request.post(opts);

    promise.then(response => {
        return res
            .status(HTTP_OK)
            .json({
                status: response.status,
                sessionId: response.sessionId
            });
    }, response => {
        LOG.error('Request failed with statusCode:' + response.statusCode);
        LOG.error('Payload ' + JSON.stringify(response.error));
        return res
            .status(response.statusCode)
            .json({ message: response.error.message });
    });
};
