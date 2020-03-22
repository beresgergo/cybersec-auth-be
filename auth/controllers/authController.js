'use strict';

const authenticationService = require('../services/authentiationService');

const HTTP_OK = 200;
const HTTP_UNAUTHORIZED = 401;

module.exports.createAuthToken = (req, res) => {
	console.log('*** AUTH: incoming request: ' + JSON.stringify(req.body));

	return res
			.status(HTTP_OK)
			.json({
				token: authenticationService.createAuthenticationToken()
			});
};

module.exports.validateAuthToken = (req, res, next) => {
	console.log('incoming request: ' + JSON.stringify(req.body));
	const promise = authenticationService.validateToken(req.body.token);

	promise.then(next, () => {
		res.status(HTTP_UNAUTHORIZED).json({failed: true});
	});
};

module.exports.protectedResource = (req, res) => {
	return res
		.status(HTTP_OK)
		.json({
			secure: true
		});
};
