'use strict';

const chai = require('chai');
const expect = chai.expect;
const events = require('events');
const httpMocks = require('node-mocks-http');
const mockery = require('mockery');

const CONSTANTS = require('../constants/index');
const HTTP_CONSTANTS = require('../../utils/httpConstants');
const MESSAGES = require('../../utils/messages');

const ZERO = 0;

function buildResponse() {
    return httpMocks.createResponse({eventEmitter: events.EventEmitter});
}

mockery.enable({
    warnOnUnregistered: false
});

const inputValidator = require('../../controllers/inputValidatorController');

describe('InputValidatorController', function() {

    describe('#setupValidValueHolders', function() {
        it('should should create empty object holders', function () {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'GET',
                url: '/user/:username',
                params: {
                    username: 'username!'
                }
            });

            inputValidator.setupValidValueHolders(request, response, () => {
                expect(response.locals.validated).not.to.be.null;
                expect(response.locals.validated.params).not.to.be.null;
                expect(response.locals.validated.body).not.to.be.null;
            });
        });
    });

    describe('#userNameValidator', function() {
        it('should return HTTP BAD request if the username contains special characters.', function(done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'GET',
                url: '/user/:username',
                params: {
                    username: 'username!'
                }
            });

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.HTTP_BAD_REQUEST);
                const payload = JSON.parse(response._getData());
                expect(payload.messages[ZERO]).to.be.equal(MESSAGES.USERNAME_INVALID_CHARACTERS);
                done();
            });

            inputValidator.setupValidValueHolders(response, response, () => {
                inputValidator.userNameValidator(request, response);
            });
        });

        it('should return HTTP BAD request if the username does not fit within the range of 4 and 10', function(done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'GET',
                url: '/user/:username',
                params: {
                    username: 'use'
                }
            });

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.HTTP_BAD_REQUEST);
                const payload = JSON.parse(response._getData());
                expect(payload.messages[ZERO]).to.be.equal(MESSAGES.USERNAME_INVALID_LENGTH);
                done();
            });

            inputValidator.setupValidValueHolders(response, response, () => {
                inputValidator.userNameValidator(request, response);
            });
        });

        it('should return pass the sanitized input to the validated locals object', function(done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'GET',
                url: '/user/:username',
                params: {
                    username: 'username'
                }
            });

            inputValidator.setupValidValueHolders(response, response, () => {
                inputValidator.userNameValidator(request, response, () => {
                    expect(response.locals.validated.params.username).to.be.equal('username');
                    done();
                });
            });
        });

    });

    describe('#totpValidator', function() {
        it('should return HTTP BAD request if the totpSecret is not base32 encoded', function(done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'POST',
                url: '/user/:username/totpSecret',
                params: {
                    username: 'username'
                },
                body: {
                    totpSecret: '!' + CONSTANTS.TOTP_SECRET
                }
            });

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.HTTP_BAD_REQUEST);
                const payload = JSON.parse(response._getData());
                expect(payload.messages[ZERO]).to.be.equal(MESSAGES.TOTP_SECRET_INVALID);
                done();
            });

            inputValidator.setupValidValueHolders(request, response, () => {
                inputValidator.totpValidator(request, response);
            });
        });


        it('should return pass the sanitized input to the validated locals object', function(done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'POST',
                url: '/user/:username/totpSecret',
                params: {
                    username: 'username'
                },
                body: {
                    totpSecret: CONSTANTS.TOTP_SECRET
                }
            });

            inputValidator.setupValidValueHolders(request, response, () => {
                inputValidator.totpValidator(request, response, () => {
                    expect(response.locals.validated.body.totpSecret).to.be.equal(request.body.totpSecret);
                    done();
                });
            });

        });
    });

    describe('#sessionIdValidator', function() {
        it('should return HTTP BAD request if the session id is not valid UUIDv4 format', function (done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'POST',
                url: '/user/:username/totpSecret',
                params: {
                    username: 'username'
                },
                body: {
                    sessionId: '1'
                }
            });

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.HTTP_BAD_REQUEST);
                const payload = JSON.parse(response._getData());
                expect(payload.messages[ZERO]).to.be.equal(MESSAGES.SESSION_INVALID);
                done();
            });

            inputValidator.setupValidValueHolders(request, response, () => {
                inputValidator.sessionIdValidator(request, response);
            });
        });


        it('should return pass the sanitized input to the validated locals object', function (done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'POST',
                url: '/user/:username/totpSecret',
                params: {
                    username: 'username'
                },
                body: {
                    sessionId: CONSTANTS.SESSION_ID
                }
            });

            inputValidator.setupValidValueHolders(request, response, () => {
                inputValidator.sessionIdValidator(request, response, () => {
                    expect(response.locals.validated.body.sessionId).to.be.equal(request.body.sessionId);
                    done();
                });
            });

        });
    });

    describe('#publicKeyValidator', function() {
        it('should return HTTP BAD request if the public key is not in base64 format', function (done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'POST',
                url: '/user/:username/publicKey',
                params: {
                    username: 'username'
                },
                body: {
                    publicKey: CONSTANTS.PUBLIC_KEY
                }
            });

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.HTTP_BAD_REQUEST);
                const payload = JSON.parse(response._getData());
                expect(payload.messages[ZERO]).to.be.equal(MESSAGES.PUBKEY_INVALID_ENCODING);
                done();
            });

            inputValidator.setupValidValueHolders(request, response, () => {
                inputValidator.publicKeyValidator(request, response);
            });
        });

        it('should pass the sanitized input to the validated locals object', function (done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'POST',
                url: '/user/:username/publicKey',
                params: {
                    username: 'username'
                },
                body: {
                    publicKey: Buffer.from(CONSTANTS.PUBLIC_KEY).toString('base64')
                }
            });

            inputValidator.setupValidValueHolders(request, response, () => {
                inputValidator.publicKeyValidator(request, response, () => {
                    expect(response.locals.validated.body.publicKey).to.be.equal(request.body.publicKey);
                    done();
                });
            });

        });
    });

    describe('preferredAuthTypeValidator', function () {
        it('should accept TOTP as preferred authentication types', function (done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'POST',
                url: '/user/:username/finalize',
                params: {
                    username: 'username'
                },
                body: {
                    preferredAuthType: 'TOTP'
                }
            });

            inputValidator.setupValidValueHolders(request, response, () => {
                inputValidator.preferredAuthTypeValidator(request, response, () => {
                    expect(response.locals.validated.body.preferredAuthType).to.be.equal(request.body.preferredAuthType);
                    done();
                });
            });
        });

        it('should accept RSA as preferred authentication types', function (done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'POST',
                url: '/user/:username/finalize',
                params: {
                    username: 'username'
                },
                body: {
                    preferredAuthType: 'RSA'
                }
            });

            inputValidator.setupValidValueHolders(request, response, () => {
                inputValidator.preferredAuthTypeValidator(request, response, () => {
                    expect(response.locals.validated.body.preferredAuthType).to.be.equal(request.body.preferredAuthType);
                    done();
                });
            });
        });

        it('should accept MFA as preferred authentication types', function (done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'POST',
                url: '/user/:username/finalize',
                params: {
                    username: 'username'
                },
                body: {
                    preferredAuthType: 'MFA'
                }
            });

            inputValidator.setupValidValueHolders(request, response, () => {
                inputValidator.preferredAuthTypeValidator(request, response, () => {
                    expect(response.locals.validated.body.preferredAuthType).to.be.equal(request.body.preferredAuthType);
                    done();
                });
            });
        });

        it('should not accept anything else as preferred authentication types', function (done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'POST',
                url: '/user/:username/finalize',
                params: {
                    username: 'username'
                },
                body: {
                    preferredAuthType: 'TOTP1'
                }
            });

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.HTTP_BAD_REQUEST);
                const payload = JSON.parse(response._getData());
                expect(payload.messages[ZERO]).to.be.equal(MESSAGES.PREFERRED_AUTH_TYPE_INVALID);
                done();
            });

            inputValidator.setupValidValueHolders(request, response, () => {
                inputValidator.preferredAuthTypeValidator(request, response);
            });
        });
    });

    describe('#jwtStringValidator', function() {
        it('should return HTTP BAD request if the token is not a valid JWT String', function (done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'POST',
                url: '/management/preferredAuthType',
                body: {
                    token: ''
                }
            });

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.HTTP_BAD_REQUEST);
                const payload = JSON.parse(response._getData());
                expect(payload.messages[ZERO]).to.be.equal(MESSAGES.JWT_INVALID);
                done();
            });

            inputValidator.setupValidValueHolders(request, response, () => {
                inputValidator.jwtStringValidator(request, response);
            });
        });

        it('should pass the sanitized input to the validated locals object', function (done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'POST',
                url: '/management/preferredAuthType',
                body: {
                    token: CONSTANTS.JWT
                }
            });

            inputValidator.setupValidValueHolders(request, response, () => {
                inputValidator.jwtStringValidator(request, response, () => {
                    expect(response.locals.validated.body.token).to.be.equal(request.body.token);
                    done();
                });
            });

        });
    });

    describe('#totpTokenValidator', function() {
        it('should return HTTP BAD request if the token is not a valid TOTP TOKEN', function (done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'POST',
                url: '/login/otpToken',
                body: {
                    token: 'not valid token'
                }
            });

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.HTTP_BAD_REQUEST);
                const payload = JSON.parse(response._getData());
                expect(payload.messages[ZERO]).to.be.equal(MESSAGES.TOTP_TOKEN_INVALID);
                done();
            });

            inputValidator.setupValidValueHolders(request, response, () => {
                inputValidator.totpTokenValidator(request, response);
            });
        });

        it('should return HTTP BAD request if the token does not contain 6 digits', function (done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'POST',
                url: '/login/otpToken',
                body: {
                    token: '1234567'
                }
            });

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.HTTP_BAD_REQUEST);
                const payload = JSON.parse(response._getData());
                expect(payload.messages[ZERO]).to.be.equal(MESSAGES.TOTP_TOKEN_INVALID_LENGTH);
                done();
            });

            inputValidator.setupValidValueHolders(request, response, () => {
                inputValidator.totpTokenValidator(request, response);
            });
        });

        it('should pass the sanitized input to the validated locals object', function (done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'POST',
                url: '/login/otpToken',
                body: {
                    token: CONSTANTS.TOTP_TOKEN
                }
            });

            inputValidator.setupValidValueHolders(request, response, () => {
                inputValidator.totpTokenValidator(request, response, () => {
                    expect(response.locals.validated.body.token).to.be.equal(request.body.token);
                    done();
                });
            });

        });
    });

    describe('#signedChallengeValidator', function() {
        it('should return HTTP BAD request if the signature is not in base64 format', function (done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'POST',
                url: '/login/signedChallenge',
                params: {
                    username: 'username'
                },
                body: {
                    signedChallenge: ''
                }
            });

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.HTTP_BAD_REQUEST);
                const payload = JSON.parse(response._getData());
                expect(payload.messages[ZERO]).to.be.equal(MESSAGES.SIGNATURE_INVALID_ENCODING);
                done();
            });

            inputValidator.setupValidValueHolders(request, response, () => {
                inputValidator.signedChallengeValidator(request, response);
            });
        });

        it('should pass the sanitized input to the validated locals object', function (done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'POST',
                url: '/login/signedChallenge',
                params: {
                    username: 'username'
                },
                body: {
                    signedChallenge: CONSTANTS.SIGNED_CHALLENGE
                }
            });

            inputValidator.setupValidValueHolders(request, response, () => {
                inputValidator.signedChallengeValidator(request, response, () => {
                    expect(response.locals.validated.body.signedChallenge).to.be.equal(request.body.signedChallenge);
                    done();
                });
            });

        });
    });

    after(function() {
        mockery.disable();
        mockery.deregisterAll();
    });
});
