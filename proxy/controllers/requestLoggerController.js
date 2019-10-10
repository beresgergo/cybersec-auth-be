'use strict';

const LOG = require('../utils/logging/log').getLogger('REQUEST_LOGGER');

module.exports.logRequest = (req, res, next) => {
	LOG.info('Incoming request');
	LOG.debug('Payload: ' + JSON.stringify(req.body));
	next();
}