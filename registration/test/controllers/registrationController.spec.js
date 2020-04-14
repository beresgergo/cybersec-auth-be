'use strict';

const chai = require('chai');
const expect = chai.expect;
const events = require('events');
const httpMocks = require('node-mocks-http');
const mockery = require('mockery');
const HTTP_CONSTANTS = require('../../utils/httpConstants');
const MESSAGES = require('../../utils/messages');
const modelMockBuilder = require('../utils/mongooseModelMock');

function buildResponse() {
    return httpMocks.createResponse({eventEmitter: events.EventEmitter})
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

            response.locals.session = {};

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.BAD_REQUEST);
                const payload = JSON.parse(response._getData());
                expect(payload.message).to.be.equal(MESSAGES.USERNAME_ALREADY_USED);
                done();
            });

            registrationController.checkUsername(request, response);
        });

        it('should return HTTP OK with appropriate message request if the username is occupied', function(done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'GET',
                url: '/user/',
                params: {
                    username: 'username1'
                }
            });

            response.locals.session = {
                id: '1',
                save: function() {
                    return {
                        then: cb => cb()
                    };
                }
            };

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

    describe('#setPassword', function() {
        it('should return HTTP BAD request if username is not present in the session', function(done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'POST',
                url: '/user/:username/setPassword',
                params: {
                    username: 'username'
                },
                body: {
                    password: 'password'
                }
            });

            response.locals.session = {};

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.BAD_REQUEST);
                const payload = JSON.parse(response._getData());
                expect(payload.message).to.be.equal(MESSAGES.DATA_MISSING_FROM_SESSION);
                done();
            });

            registrationController.setPassword(request, response);
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
                    password: 'password'
                }
            });

            response.locals.session = {
                username: 'username',
                save: function() {
                    return {
                        then: cb => cb()
                    };
                }
            };

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.locals.session.username).to.be.equal('username');
                expect(response.locals.session.setPassword).to.be.equal('password');
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.HTTP_OK);
                const payload = JSON.parse(response._getData());
                expect(payload.status).to.be.equal(MESSAGES.STATUS_OK);
                done();
            });

            registrationController.setPassword(request, response);
        });
    });

    describe('#confirmPassword', function() {
        it('should return HTTP BAD REQUEST if the session does not contain the setPassword field', function(done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'POST',
                url: '/user/:username/confirmPassword',
                params: {
                    username: 'username'
                },
                body: {
                    confirmPassword: 'password'
                }
            });

            response.locals.session = {
                username: 'username'
            };

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.BAD_REQUEST);
                const payload = JSON.parse(response._getData());
                expect(payload.message).to.be.equal(MESSAGES.DATA_MISSING_FROM_SESSION);
                done();
            });

            registrationController.confirmPassword(request, response);
        });

        it('should return HTTP BAD REQUEST if the password from session does not match with the http body', function(done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'POST',
                url: '/user/:username/confirmPassword',
                params: {
                    username: 'username'
                },
                body: {
                    confirmPassword: 'password'
                }
            });

            response.locals.session = {
                username: 'username',
                setPassword: 'password1'
            };

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.BAD_REQUEST);
                const payload = JSON.parse(response._getData());
                expect(payload.message).to.be.equal(MESSAGES.PASSWORD_MISMATCH);
                done();
            });

            registrationController.confirmPassword(request, response);
        });

        it('should return HTTP ok and store the value in the session object', function(done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'POST',
                url: '/user/:username/confirmPassword',
                params: {
                    username: 'username'
                },
                body: {
                    confirmPassword: 'password'
                }
            });

            response.locals.session = {
                username: 'username',
                setPassword: 'password',
                save: function() {
                    return {
                        then: cb => cb()
                    };
                }
            };

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.HTTP_OK);
                const payload = JSON.parse(response._getData());
                expect(payload.status).to.be.equal(MESSAGES.STATUS_OK);
                done();
            });

            registrationController.confirmPassword(request, response);
        });
    });

    describe('#finalize', function() {
        it('should return HTTP BAD REQUEST if confirmPassword field is not present in the session', function(done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'POST',
                url: '/user/:username/finalize',
                params: {
                    username: 'username'
                }
            });

            response.locals.session = {
                username: 'username'
            };

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.BAD_REQUEST);
                const payload = JSON.parse(response._getData());
                expect(payload.message).to.be.equal(MESSAGES.DATA_MISSING_FROM_SESSION);
                done();
            });

            registrationController.finalize(request, response);
        });

        it('should return HTTP OK and store the user credentials in the appropriate store', function(done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'POST',
                url: '/user/:username/finalize',
                params: {
                    username: 'username'
                }
            });

            response.locals.session = {
                username: 'username',
                setPassword: 'password',
                confirmPassword: 'password'
            };

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

    after(function() {
        mockery.disable();
        mockery.deregisterAll();
    });
});
