'use strict';

const chai = require('chai');
const expect = chai.expect;
const events = require('events');
const httpMocks = require('node-mocks-http');
const mockery = require('mockery');
const HTTP_CONSTANTS = require('../../utils/httpConstants');
const MESSAGES = require('../../utils/messages');
const modelMockBuilder = require('../utils/mongooseModelMock');
const { createSessionMock } = require('../utils/sessionMock');

function buildResponse() {
    return httpMocks.createResponse({eventEmitter: events.EventEmitter});
}

mockery.enable({
    warnOnUnregistered: false
});

mockery.registerMock('../models/userStore', modelMockBuilder.createModelMock({
    username: 'username',
    password: '',
    publicKey: ''
}));

const registrationController = require('../../controllers/registrationController');

describe('Registration Controller', function() {

    describe('#checkUserName', function() {
        it('should return HTTP BAD request if the username is occupied', function(done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'GET',
                url: '/user/:username',
                params: {
                    username: 'username'
                }
            });

            response.locals.session = createSessionMock({ id: '1' });

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.BAD_REQUEST);
                const payload = JSON.parse(response._getData());
                expect(payload.message).to.be.equal(MESSAGES.USERNAME_ALREADY_USED);
                done();
            });

            registrationController.checkUsername(request, response);
        });

        it('should return HTTP OK with appropriate message request if the username is not occupied', function(done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'GET',
                url: '/user/',
                params: {
                    username: 'username1'
                }
            });

            response.locals.session = createSessionMock({ id: '1' });

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.HTTP_OK);
                expect(response.locals.session.username).to.be.equal('username1');
                const payload = JSON.parse(response._getData());
                expect(payload.status).to.be.equal(MESSAGES.STATUS_OK);
                expect(payload.sessionId).to.be.equal('1');
                done();
            });

            registrationController.checkUsername(request, response);
        });
    });

    describe('#setTotpSecret', function() {
        it('should return HTTP BAD request if username is not present in the session', function(done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'POST',
                url: '/user/:username/setPassword',
                params: {
                    username: 'username'
                },
                body: {
                    totpSecret: 'totpSecret'
                }
            });

            response.locals.session = createSessionMock({ id: '1' });

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.BAD_REQUEST);
                const payload = JSON.parse(response._getData());
                expect(payload.message).to.be.equal(MESSAGES.DATA_MISSING_FROM_SESSION);
                done();
            });

            registrationController.totpSecret(request, response);
        });

        it('should return HTTP OK with and store the password in the session object', function(done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'POST',
                url: '/user/:username/setPassword',
                params: {
                    username: 'username'
                },
                body: {
                    totpSecret: 'totpSecret'
                }
            });

            response.locals.session = createSessionMock({ username: 'username' });

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.locals.session.username).to.be.equal('username');
                expect(response.locals.session.totpSecret).to.be.equal('totpSecret');
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.HTTP_OK);
                const payload = JSON.parse(response._getData());
                expect(payload.status).to.be.equal(MESSAGES.STATUS_OK);
                done();
            });

            registrationController.totpSecret(request, response);
        });
    });

    describe('#publicKey', function() {
        it('should return HTTP BAD REQUEST if totpSecret is not present in the session', function(done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'POST',
                url: '/user/:username/publicKey',
                params: {
                    username: 'username'
                },
                body: {
                    encoded: 'base64EncodedPublicKey'
                }
            });

            response.locals.session = createSessionMock({ });

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.BAD_REQUEST);
                const payload = JSON.parse(response._getData());
                expect(payload.message).to.be.equal(MESSAGES.DATA_MISSING_FROM_SESSION);
                done();
            });

            registrationController.publicKey(request, response);
        });

        it('should return HTTP OK and store the public key in the session', function(done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'POST',
                url: '/user/:username/publicKey',
                params: {
                    username: 'username'
                },
                body: {
                    encoded: 'base64EncodedPublicKey'
                }
            });

            response.locals.session = createSessionMock({ totpSecret: 'totpSecret' });

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.HTTP_OK);
                const payload = JSON.parse(response._getData());
                expect(payload.status).to.be.equal(MESSAGES.STATUS_OK);
                done();
            });

            registrationController.publicKey(request, response);
        });
    });

    describe('#finalize', function() {
        it('should return HTTP BAD REQUEST if publicKey field is not present in the session', function(done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'POST',
                url: '/user/:username/finalize',
                params: {
                    username: 'username'
                }
            });

            response.locals.session = createSessionMock({});

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.BAD_REQUEST);
                const payload = JSON.parse(response._getData());
                expect(payload.message).to.be.equal(MESSAGES.DATA_MISSING_FROM_SESSION);
                done();
            });

            registrationController.finalize(request, response);
        });

        it('should return HTTP OK and store the public key in the appropriate store', function(done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'POST',
                url: '/user/:username/finalize',
                params: {
                    username: 'username'
                }
            });

            response.locals.session = createSessionMock({ publicKey : 'publicKey' });

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.HTTP_OK);
                const payload = JSON.parse(response._getData());
                expect(payload.status).to.be.equal(MESSAGES.STATUS_OK);
                done();
            });

            registrationController.finalize(request, response);
        });

    });

    describe('#deleteUser', function () {
        it('should return HTTP OK with an appropriate status message', function (done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'DELETE',
                url: '/user/',
                params: {
                    username: 'username'
                }
            });

            response.locals.username = 'username';

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.HTTP_OK);
                const payload = JSON.parse(response._getData());
                expect(payload.status).to.be.equal(MESSAGES.STATUS_OK);
                done();
            });

            registrationController.deleteUser(request, response);
        });
    });

    after(function() {
        mockery.disable();
        mockery.deregisterAll();
    });
});
