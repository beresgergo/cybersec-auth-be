'use strict';

const HTTP_CONSTANTS = require('../../utils/httpConstants');

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

mockery.registerMock('../config/index', {
    authBaseConfig: {},
    getProtectedResourceConfig: {}
});

const authenticationController = require('../../controllers/authController');

describe('AuthController', function () {

    describe('#getAuthenticationToken', function () {

    });

    describe('#getProtectedResource', function () {

    });

    describe('#ping', function () {
        it('should always return HTTP 200', function (done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method:'GET',
                url: '/auth'
            });

            response.on('end', function () {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.HTTP_OK);
                const payload = JSON.parse(response._getData());
                expect(payload.status).to.be.equal('OK');
                done();
            });

            authenticationController.ping(request, response);
        });
    });

    after(function() {
        mockery.disable();
        mockery.deregisterAll();
    });
});
