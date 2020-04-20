'use strict';

const chai = require('chai');
const expect = chai.expect;
const events = require('events');
const httpMocks = require('node-mocks-http');
const mockery = require('mockery');
const HTTP_CONSTANTS = require('../../utils/httpConstants');
const MESSAGES = require('../../utils/messages');
const modelMockBuilder = require('../utils/mongooseModelMock');
const cryptoMock = require('../utils/cryptoMock');
const { authenticationServiceMock } = require('../utils/authenticationServiceMock');
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

mockery.registerMock('crypto', cryptoMock);

mockery.registerMock('../models/userStore', modelMockBuilder.createModelMock({
    username: 'username',
    password: '',
    publicKey: ''
}));

mockery.registerMock('../services/authentiationService', authenticationServiceMock);

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

            response.locals.session = createSessionMock('1');

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

            response.locals.session = createSessionMock('1');

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

    describe('#generateChallenge', function() {
        it('should return HTTP bad request if username is not present in the session', function(done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method:'GET',
                url: '/login/challenge'
            });

            response.locals.session = createSessionMock('1');

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.BAD_REQUEST);
                const payload = JSON.parse(response._getData());
                expect(payload.message).to.be.equal(MESSAGES.DATA_MISSING_FROM_SESSION);
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
                expect(payload.token).to.be.equal('authToken');
                done();
            });

            authenticationController.checkSignature(request, response);
        });
    });

    describe('#validateAuthToken', function() {
        it('should call auhtentication service to validate the given token', function() {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method:'POST',
                url: '/protected'
            });

            authenticationController.validateAuthToken(request, response, (result) => {
                expect(result).to.be.true;
            });
        });
    });

    describe('#protectedResource', function() {
        it('should return a simple json object', function(done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method:'POST',
                url: '/protected'
            });

            response.on('end', function() {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.HTTP_OK);
                const payload = JSON.parse(response._getData());
                expect(payload.secure).to.be.true;
                done();
            });

            authenticationController.protectedResource(request, response);
        });
    });

    after(function() {
        mockery.disable();
        mockery.deregisterAll();
    });

});
