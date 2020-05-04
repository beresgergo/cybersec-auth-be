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
                expect(payload.messages[ZERO]).to.be.equal(MESSAGES.TOTP_INVALID);
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

    after(function() {
        mockery.disable();
        mockery.deregisterAll();
    });
});
