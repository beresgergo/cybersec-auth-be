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

mockery.registerMock('../models/sessionStore', modelMockBuilder.createModelMock({
    id: '1',
    username: 'username',
    totpDone: false,
    rsaDone: false,
    preferredAuthType: 'preferredAuthType',
    challenge: 'challenge'
}));

mockery.registerMock('uuid', {
    v4: () => { return '1'; }
});

mockery.registerMock('../config/index', {});

const sessionController = require('../../controllers/sessionController');

describe('SessionController', function() {

    describe('#createSession', function() {
        it('should create a plain session and persist the document', function(done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'GET',
                url: '/user/10'
            });

            sessionController.createSession(request, response, () => {
                const session = response.locals.session;
                expect(session).to.be.an('Object');
                expect(session.id).to.equal('1');
                expect(session.username).to.be.equal('');
                expect(session.totpDone).to.be.false;
                expect(session.rsaDone).to.be.false;
                expect(session.challenge).to.be.equal('');
                expect(session.preferredAuthType).to.be.equal('');

                done();
            });
        });
    });

    describe('#populateSession', function() {
        it('should return HTTP BAD REQUEST if the sessionID is present int he request body', function(done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'GET',
                url: '/user/10',
                body: { sessionId: '' }
            });

            response.on('end', function() {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.BAD_REQUEST);
                const payload = JSON.parse(response._getData());
                expect(payload.message).to.be.equal(MESSAGES.SESSION_ID_MISSING);
                done();
            });
            sessionController.populateSession(request, response);
        });

        it('should return HTTP BAD REQUEST if the sessionIs is not found in the store', function(done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'GET',
                url: '/user/10',
                body: { sessionId: '2' }
            });

            response.on('end', function() {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.BAD_REQUEST);
                const payload = JSON.parse(response._getData());
                expect(payload.message).to.be.equal(MESSAGES.SESSION_ID_NOT_FOUND);
                done();
            });
            sessionController.populateSession(request, response);
        });

        it('should call next callback otherwise while forwarding the session object', function(done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'GET',
                url: '/user/10',
                body: { sessionId: '1' }
            });

            sessionController.populateSession(request, response, () => {
                const session = response.locals.session;
                expect(session).to.be.an('Object');
                expect(session.id).to.equal('1');
                expect(session.username).to.be.equal('username');
                expect(session.totpDone).to.be.false;
                expect(session.rsaDone).to.be.false;
                expect(session.challenge).to.be.equal('challenge');
                expect(session.preferredAuthType).to.be.equal('preferredAuthType');

                done();
            });
        });
    });

    describe('#removeSession', function() {
        it('should return HTTP BAD REQUEST if the sessionID is present int he request body', function(done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'GET',
                url: '/user/10',
                body: { sessionId: '' }
            });

            response.on('end', function() {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(HTTP_CONSTANTS.BAD_REQUEST);
                const payload = JSON.parse(response._getData());
                expect(payload.message).to.be.equal(MESSAGES.SESSION_ID_MISSING);
                done();
            });
            sessionController.removeSession(request, response);
        });

        it('otherwise should just invoke the next callback', function(done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method: 'GET',
                url: '/user/10',
                body: { sessionId: '1' }
            });

            sessionController.removeSession(request, response, () => {
                expect(true).to.be.true;
                done();
            });
        });
    });

    after(function() {
        mockery.disable();
        mockery.deregisterAll();
    });
});
