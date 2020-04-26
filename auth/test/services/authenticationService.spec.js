'use strict';

const chai = require('chai');
const expect = chai.expect;
const mockery = require('mockery');

const jsonwebtokenMock = require('../utils/jsonwebtokenMock');
const configurationMock = require('../utils/configurationMock');

mockery.enable({
    warnOnUnregistered: false
});

mockery.registerMock(configurationMock.moduleName, configurationMock);
mockery.registerMock(jsonwebtokenMock.moduleName, jsonwebtokenMock);

const authenticationService = require('../../services/authenticationService');

describe('AuthenticationService', function() {
    describe('#createAuthenticationToken', function() {
        it('should always return authToken', function() {
            authenticationService.createAuthenticationToken().then(token  => {
                expect(token).to.be.equal('authToken');
            });
        });
    });

    describe('#validateToken', function() {
        it('should resolve the promise if the input is authToken', function(done) {
            const promise = authenticationService.validateToken('authToken');
            promise.then(() => {
                expect(true).to.be.true;
                done();
            }, () => {
                // TO verify this is not even called
                expect(true).to.be.false;
                done();
            });
        });

        it('should reject the promise if the input is not authToken', function(done) {
            const promise = authenticationService.validateToken('');
            promise.then(() => {
                // TO verify this is not even called
                expect(true).to.be.false;
                done();
            }, () => {
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
