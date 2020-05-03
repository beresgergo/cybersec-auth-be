'use strict';

const chai = require('chai');
const expect = chai.expect;
const events = require('events');
const httpMocks = require('node-mocks-http');
const mockery = require('mockery');

const HTTP_CONSTANTS = require('../../utils/httpConstants');
const MESSAGES = require('../../utils/messages');

function buildResponse() {
    return httpMocks.createResponse({eventEmitter: events.EventEmitter});
}

mockery.enable({
    warnOnUnregistered: false
});

const inputValidator = require('../../controllers/inputValidatorController');

describe('InputValidatorController', function() {

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
                expect(payload.messages[0]).to.be.equal(MESSAGES.USERNAME_INVALID_CHARACTERS);
                done();
            });

            inputValidator.userNameValidator(request, response);
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
                expect(payload.messages[0]).to.be.equal(MESSAGES.USERNAME_INVALID_LENGTH);
                done();
            });

            inputValidator.userNameValidator(request, response);
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

            inputValidator.userNameValidator(request, response, () => {
                expect(response.locals.validated.username).to.be.equal('username');
                done();
            });
        });

    });

    after(function() {
        mockery.disable();
        mockery.deregisterAll();
    });
});
