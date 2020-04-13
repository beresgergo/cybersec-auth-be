const authenticationService = require('../../services/authentiationService');
const chai = require('chai');
const expect = chai.expect;

describe('AuthenticationService', function() {
    describe('#createAuthenticationToken', function() {
        it('should always return authToken', function() {
            const authToken = authenticationService.createAuthenticationToken();
            expect(authToken).to.be.equal('authToken');
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
});
