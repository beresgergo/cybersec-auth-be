const chai = require('chai');
const expect = chai.expect;
const httpMocks = require('node-mocks-http');
const mockery = require('mockery');

function buildResponse() {
    return httpMocks.createResponse({eventEmitter: require('events').EventEmitter})
}

mockery.enable({
    warnOnUnregistered: false
});

const authenticationServiceMock = {
    createAuthenticationToken: () => 'authToken',
    validateToken: (_) => {
        return new Promise((resolve, _) => {
            resolve(true);
        });
    }
};
mockery.registerMock('../services/authentiationService', authenticationServiceMock);

const authenticationController = require('../../controllers/authController');

describe('AuthenticationController', function() {

    describe('#createAuthToken', function() {
        it('should always return a token', function(done) {
            const response = buildResponse();
            const request = httpMocks.createRequest({
                method:'GET',
                url: '/auth'
            });

            response.on('end', function() {
                expect(response._isJSON()).to.be.true;
                expect(response.statusCode).to.be.equal(200);
                const payload = JSON.parse(response._getData());
                expect(payload.token).to.be.equal('authToken');
                done();
            });

            authenticationController.createAuthToken(request, response);
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
                expect(response.statusCode).to.be.equal(200);
                const payload = JSON.parse(response._getData());
                expect(payload.secure).to.be.true;
                done();
            });

            authenticationController.protectedResource(request, response);
        });
    });

    after(function() {
        mockery.disable();
    });

});
