'use strict';

const HTTP_CONSTANTS = require('../../utils/httpConstants');
const MESSAGES = require('../../utils/messages');

const chai = require('chai');
const expect = chai.expect;
const events = require('events');
const httpMocks = require('node-mocks-http');
const mockery = require('mockery');

function buildResponse() {
    return httpMocks.createResponse({eventEmitter: events.EventEmitter});
}

mockery.enable({
    warnOnUnregistered: false
});

const tokenServiceMock = require('../utils/tokenServiceMock');
const configurationMock = require('../utils/configurationMock');

mockery.registerMock(tokenServiceMock.moduleName, tokenServiceMock);
mockery.registerMock(configurationMock.moduleName, configurationMock);

const authenticationController = require('../../controllers/authenticationController');

describe('AuthenticationController', function() {
    describe('#verifyToken', function() {
        it('should return HTTP Unauthorized if the token validation fails', function (done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method:'POST',
                url: '/verifyToken',
                body: {
                    token: 'notAuthToken'
                }
            });

            authenticationController.verifyToken(request, response);
            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.HTTP_UNAUTHORIZED);
                const payload = JSON.parse(response._getData());
                expect(payload.message).to.be.equal(MESSAGES.INVALID_JWT_TOKEN);
                done();
            });
        });

        it('should populate the username from JWT if the validation succeeds.', function (done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method:'POST',
                url: '/verifyToken',
                body: {
                    token: 'authToken'
                }
            });

            authenticationController.verifyToken(request, response, () => {
                expect(response.locals.username).to.be.equal('username');
                done();
            });

        });
    });
});
