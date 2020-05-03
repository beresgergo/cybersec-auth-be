'use strict';

const AUTHENTICATION_CONSTANTS = require('../../utils/authenticationConstants');
const HTTP_CONSTANTS = require('../../utils/httpConstants');
const MESSAGES = require('../../utils/messages');

const chai = require('chai');
const expect = chai.expect;
const events = require('events');
const httpMocks = require('node-mocks-http');
const mockery = require('mockery');
const modelMockBuilder = require('../utils/mongooseModelMock');

const authenticationServiceMock = require('../utils/authenticationServiceMock');
const configurationMock = require('../utils/configurationMock');
const cryptoMock = require('../utils/cryptoMock');
const otpLibMock = require('../utils/otpLibMock');

const { createSessionMock } = require('../utils/sessionMock');


function buildResponse() {
    return httpMocks.createResponse({eventEmitter: events.EventEmitter});
}

mockery.enable({
    warnOnUnregistered: false
});

mockery.registerMock('uuid', {
    v4: () => { return '1'; }
});

mockery.registerMock(configurationMock.moduleName, configurationMock);
mockery.registerMock(cryptoMock.moduleName, cryptoMock);


mockery.registerMock('../models/userStore', modelMockBuilder.createModelMock({
    username: 'username',
    password: '',
    publicKey: ''
}));

mockery.registerMock(authenticationServiceMock.moduleName, authenticationServiceMock);

mockery.registerMock(otpLibMock.moduleName, otpLibMock);

const authenticationController = require('../../controllers/authController');

describe('AuthenticationController', function() {

    describe('#startAuthentication', function() {
        it('should return HTTP BAD REQUEST if login is started with a not known username', function(done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method:'GET',
                url: '/login/:username',
                params: {
                    username: 'username1'
                }
            });

            response.locals.session = createSessionMock({id: '1'});

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.BAD_REQUEST);
                const payload = JSON.parse(response._getData());
                expect(payload.message).to.be.equal(MESSAGES.USERNAME_NOT_FOUND);
                done();
            });

            authenticationController.startAuthentication(request, response);
        });

        it('should return HTTP OK with the session id otherwise', function(done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method:'GET',
                url: '/login/:username',
                params: {
                    username: 'username'
                }
            });

            response.locals.session = createSessionMock({id: '1'});

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.HTTP_OK);
                const payload = JSON.parse(response._getData());
                expect(payload.sessionId).to.be.equal('1');
                done();
            });

            authenticationController.startAuthentication(request, response);
        });
    });

    describe('#verifyTotpToken', function () {

        it('should return HTTP bad request if preferredAuthType and username are not present in the session', function (done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method:'POST',
                url: '/login/otpToken',
                body: {}
            });

            response.locals.session = createSessionMock({});

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.BAD_REQUEST);
                const payload = JSON.parse(response._getData());
                expect(payload.message).to.be.equal(MESSAGES.DATA_MISSING_FROM_SESSION);
                done();
            });

            authenticationController.verifyTotpToken(request, response);
        });

        it('should return HTTP bad request if preferredAuthType is RSA it should return a BAD REQUEST', function (done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method:'POST',
                url: '/login/otpToken',
                body: {}
            });

            response.locals.session = createSessionMock({
                username: 'username',
                preferredAuthType: AUTHENTICATION_CONSTANTS.PREFERRED_AUTHENTICATION_RSA
            });

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.BAD_REQUEST);
                const payload = JSON.parse(response._getData());
                expect(payload.message).to.be.equal(MESSAGES.AUTHENTICATION_TYPE_MISMATCH);
                done();
            });

            authenticationController.verifyTotpToken(request, response);
        });

        it('should return BAD request if the token verification fails', function (done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method:'POST',
                url: '/login/otpToken',
                body: {
                    token: 'notValid'
                }
            });

            response.locals.session = createSessionMock({
                username: 'username',
                preferredAuthType: AUTHENTICATION_CONSTANTS.PREFERRED_AUTHENTICATION_TOTP
            });

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.BAD_REQUEST);
                const payload = JSON.parse(response._getData());
                expect(payload.message).to.be.equal(MESSAGES.INVALID_TOTP_TOKEN);
                done();
            });

            authenticationController.verifyTotpToken(request, response);
        });

        it('should return HTTP OK if token verification succeeds and save it to the session', function (done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method:'POST',
                url: '/login/otpToken',
                body: {
                    token: 'valid'
                }
            });

            response.locals.session = createSessionMock({
                username: 'username',
                preferredAuthType: AUTHENTICATION_CONSTANTS.PREFERRED_AUTHENTICATION_TOTP
            });

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.HTTP_OK);
                const payload = JSON.parse(response._getData());
                expect(payload.status).to.be.equal(MESSAGES.STATUS_OK);
                done();
            });

            authenticationController.verifyTotpToken(request, response);
        });

    });

    describe('#generateChallenge', function() {
        it('should return HTTP bad request if username is not present in the session', function(done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method:'GET',
                url: '/login/challenge'
            });

            response.locals.session = createSessionMock({id: '1'});

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.BAD_REQUEST);
                const payload = JSON.parse(response._getData());
                expect(payload.message).to.be.equal(MESSAGES.DATA_MISSING_FROM_SESSION);
                done();
            });

            authenticationController.generateChallenge(request, response);
        });

        it('should return HTTP bad request if preferredAuthType is TOTP', function(done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method:'GET',
                url: '/login/challenge'
            });

            response.locals.session = createSessionMock({
                username: 'username',
                preferredAuthType: AUTHENTICATION_CONSTANTS.PREFERRED_AUTHENTICATION_TOTP
            });

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.BAD_REQUEST);
                const payload = JSON.parse(response._getData());
                expect(payload.message).to.be.equal(MESSAGES.AUTHENTICATION_TYPE_MISMATCH);
                done();
            });

            authenticationController.generateChallenge(request, response);
        });

        it('should return HTTP and a generated challenge', function(done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method:'GET',
                url: '/login/challenge'
            });

            response.locals.session = createSessionMock({ id: '1', username : 'username'});

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.HTTP_OK);
                const payload = JSON.parse(response._getData());
                expect(payload.challenge).to.be.equal('1');
                done();
            });

            authenticationController.generateChallenge(request, response);
        });
    });

    describe('#checkSignature', function() {
        it('should return HTTP BAD REQUEST if challenge is missing from the session', function(done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method:'POST',
                url: '/login/challenge'
            });

            response.locals.session = createSessionMock({ id : '1' });

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.BAD_REQUEST);
                const payload = JSON.parse(response._getData());
                expect(payload.message).to.be.equal(MESSAGES.DATA_MISSING_FROM_SESSION);
                done();
            });

            authenticationController.checkSignature(request, response);
        });

        it('should return HTTP BAD REQUEST if cannot verify signature', function(done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method:'POST',
                url: '/login/challenge',
                body: {
                    signedChallenge: 'NOK'
                }
            });

            response.locals.session = createSessionMock({
                id: '1',
                username: 'username',
                challenge: 'NOK'
            });

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.BAD_REQUEST);
                const payload = JSON.parse(response._getData());
                expect(payload.message).to.be.equal(MESSAGES.INVALID_SIGNATURE);
                done();
            });

            authenticationController.checkSignature(request, response);
        });

        it('should return HTTP OK with authentication token if the verification succeed.', function(done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method:'POST',
                url: '/login/challenge',
                body: {
                    signedChallenge: 'OK'
                }
            });

            response.locals.session = createSessionMock({
                id: '1',
                username: 'username',
                challenge: 'OK'
            });

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.HTTP_OK);
                const payload = JSON.parse(response._getData());
                expect(payload.message).to.be.equal(MESSAGES.STATUS_OK);
                done();
            });

            authenticationController.checkSignature(request, response);
        });
    });

    describe('#token', function () {
        it('should return HTTP BAD request if the session is not set up properly', function (done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method:'GET',
                url: '/token'
            });

            response.locals.session = createSessionMock({
                preferredAuthType: AUTHENTICATION_CONSTANTS.PREFERRED_AUTHENTICATION_TOTP,
                totpDone: false,
            });

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.BAD_REQUEST);
                const payload = JSON.parse(response._getData());
                expect(payload.message).to.be.equal(MESSAGES.AUTHENTICATION_TYPE_MISMATCH);
                done();
            });

            authenticationController.token(request, response);
        });

        it('should return HTTP OK if with the token if the validation succeeds', function (done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method:'GET',
                url: '/token'
            });

            response.locals.session = createSessionMock({
                preferredAuthType: AUTHENTICATION_CONSTANTS.PREFERRED_AUTHENTICATION_TOTP,
                totpDone: true,
            });

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.HTTP_OK);
                const payload = JSON.parse(response._getData());
                expect(payload.token).to.be.equal('authToken');
                done();
            });

            authenticationController.token(request, response);
        });
    });

    describe('#validateAuthToken', function() {
        it('should return HTTP Unauthorized if the token validation fails', function (done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method:'POST',
                url: '/verifyToken',
                body: {
                    token: 'notAuthToken'
                }
            });

            authenticationController.validateAuthToken(request, response);
            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.HTTP_UNAUTHORIZED);
                const payload = JSON.parse(response._getData());
                expect(payload.message).to.be.equal(MESSAGES.INVALID_JWT_TOKEN);
                done();
            });
        });

        it('should return HTTP OK if the token validation succeeds', function (done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method:'POST',
                url: '/verifyToken',
                body: {
                    token: 'authToken'
                }
            });

            authenticationController.validateAuthToken(request, response);
            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.HTTP_OK);
                const payload = JSON.parse(response._getData());
                expect(payload.status).to.be.equal(MESSAGES.STATUS_OK);
                done();
            });
        });
    });

    after(function() {
        mockery.disable();
        mockery.deregisterAll();
    });

});
