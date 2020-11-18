'use strict';

const winston = require('winston');
const { LOGGING_OPTIONS } = require('../config/index');
const LOG = winston.createLogger(LOGGING_OPTIONS);

module.exports.handleHttpError = (body, res) => {
    response
        .json()
        .then(body => {
            LOG.error('Request failed with statusCode:' + response.statusCode);
            LOG.error('Payload ' + JSON.stringify(response.error));
            res.status(response.status);
            res.json(body);
        });
};
