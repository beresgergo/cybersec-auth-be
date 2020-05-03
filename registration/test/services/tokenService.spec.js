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

const tokenService = require('../../services/tokenService');

describe('tokenService', function() {
    describe('#verifyToken', function() {
        it('should resolve the promise if the input is authToken', function(done) {
            const promise = tokenService.verifyToken('authToken');
            promise.then(decodedPayload => {
                expect(decodedPayload.username).to.be.equal('username');

                done();
            }, () => {
                // TO verify this is not even called
                expect(true).to.be.false;
                done();
            });
        });

        it('should reject the promise if the input is not authToken', function(done) {
            const promise = tokenService.verifyToken('');
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
