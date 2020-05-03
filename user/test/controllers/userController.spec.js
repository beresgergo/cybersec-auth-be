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
    return httpMocks.createResponse({eventEmitter: events.EventEmitter});
}

mockery.enable({
    warnOnUnregistered: false
});

mockery.registerMock('../models/userStore', modelMockBuilder.createModelMock({
    username: 'username',
    totpSecret: '',
    publicKey: '',
    preferredAuthType: ''
}));

const userController = require('../../controllers/userController');

describe('User Controller', function() {

    describe('#deleteUser', function () {
        it('should return HTTP OK with an appropriate status message', function (done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'DELETE',
                url: '/user'
            });

            response.locals.username = 'username';

            response.on('end', () => {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.HTTP_OK);
                const payload = JSON.parse(response._getData());
                expect(payload.status).to.be.equal(MESSAGES.STATUS_OK);
                done();
            });

            userController.deleteUser(request, response);
        });
    });

    describe('#changePreferredAuthenticationType', function () {
        it('should return HTTP OK with an appropriate status message', function (done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'POST',
                url: '/user/preferredAuthType',
                body: {
                    newAuthType: 'authType'
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

            userController.changePreferredAuthenticationType(request, response);
        });
    });

    after(function() {
        mockery.disable();
        mockery.deregisterAll();
    });
});
